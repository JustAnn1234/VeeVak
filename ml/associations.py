import json
from collections import defaultdict
from itertools import combinations
from datetime import date, timedelta


def get_transaction_baskets(shop_id: int, conn) -> list:
    """
    Pull all sales and build transaction baskets.
    Each basket is a set of product names bought in one order.
    """
    cursor = conn.cursor()
    cursor.execute("""
        SELECT products FROM sales
        WHERE shop_id = ?
        AND order_status != 'cancelled'
        AND products IS NOT NULL
    """, (shop_id,))
    rows = cursor.fetchall()

    baskets = []
    for row in rows:
        try:
            products = json.loads(row["products"] if isinstance(row, dict) else row[0])
            names = set()
            for p in products:
                name = p.get("name", "").strip()
                if name and name.lower() not in ["unknown", ""]:
                    names.add(name)
            if len(names) >= 1:
                baskets.append(names)
        except Exception:
            continue

    return baskets


def calculate_support(itemset: frozenset, baskets: list) -> float:
    """Support = % of transactions containing this itemset."""
    count = sum(1 for basket in baskets if itemset.issubset(basket))
    return count / len(baskets) if baskets else 0


def calculate_confidence(antecedent: frozenset, consequent: frozenset, baskets: list) -> float:
    """Confidence = P(consequent | antecedent)."""
    antecedent_count = sum(1 for basket in baskets if antecedent.issubset(basket))
    if antecedent_count == 0:
        return 0
    both_count = sum(1 for basket in baskets if antecedent.issubset(basket) and consequent.issubset(basket))
    return both_count / antecedent_count


def calculate_lift(support_rule: float, support_antecedent: float, support_consequent: float) -> float:
    """Lift > 1 means items are bought together more than by chance."""
    denominator = support_antecedent * support_consequent
    if denominator == 0:
        return 0
    return support_rule / denominator


def run_apriori(baskets: list, min_support: float = 0.05, min_confidence: float = 0.3) -> list:
    """
    Simplified Apriori implementation.
    Finds frequent itemsets and generates association rules.
    Returns rules sorted by lift descending.
    """
    if not baskets:
        return []

    # Get all unique items
    all_items = set()
    for basket in baskets:
        all_items.update(basket)

    # Find frequent single items
    frequent_items = {}
    for item in all_items:
        support = calculate_support(frozenset([item]), baskets)
        if support >= min_support:
            frequent_items[frozenset([item])] = support

    if not frequent_items:
        return []

    # Find frequent pairs
    frequent_pairs = {}
    items_list = list(all_items)
    for i in range(len(items_list)):
        for j in range(i + 1, len(items_list)):
            pair = frozenset([items_list[i], items_list[j]])
            support = calculate_support(pair, baskets)
            if support >= min_support:
                frequent_pairs[pair] = support

    # Generate association rules from pairs
    rules = []
    for pair, support in frequent_pairs.items():
        items = list(pair)
        for i in range(len(items)):
            antecedent = frozenset([items[i]])
            consequent = frozenset([items[1 - i]])

            confidence = calculate_confidence(antecedent, consequent, baskets)
            if confidence >= min_confidence:
                support_ant = frequent_items.get(antecedent, 0)
                support_con = frequent_items.get(consequent, 0)
                lift = calculate_lift(support, support_ant, support_con)

                rules.append({
                    "antecedent": list(antecedent)[0],
                    "consequent": list(consequent)[0],
                    "support": round(support, 3),
                    "confidence": round(confidence, 3),
                    "lift": round(lift, 3),
                })

    # Sort by lift descending
    rules.sort(key=lambda x: x["lift"], reverse=True)
    return rules


def get_product_recommendations(shop_id: int, conn) -> dict:
    """
    Main function that runs Apriori and returns:
    - Association rules with plain-English explanations
    - Per-product recommendations (what goes well with each product)
    - Bundle suggestions for the seller
    """
    baskets = get_transaction_baskets(shop_id, conn)

    if len(baskets) < 5:
        return {
            "enough_data": False,
            "message": "Need at least 5 sales transactions to find product patterns. Keep logging sales.",
            "rules": [],
            "recommendations": {},
            "bundles": [],
        }

    # Count single product frequencies for context
    product_freq = defaultdict(int)
    for basket in baskets:
        for item in basket:
            product_freq[item] += 1

    # Adjust min_support based on dataset size
    # Smaller datasets need lower support threshold
    if len(baskets) < 20:
        min_support = 0.05
        min_confidence = 0.25
    elif len(baskets) < 50:
        min_support = 0.08
        min_confidence = 0.3
    else:
        min_support = 0.1
        min_confidence = 0.35

    rules = run_apriori(baskets, min_support=min_support, min_confidence=min_confidence)

    if not rules:
        # Fall back to most frequent co-occurrences even without strong rules
        co_occurrences = defaultdict(int)
        for basket in baskets:
            items = list(basket)
            for i in range(len(items)):
                for j in range(i + 1, len(items)):
                    pair = tuple(sorted([items[i], items[j]]))
                    co_occurrences[pair] += 1

        if co_occurrences:
            top_pairs = sorted(co_occurrences.items(), key=lambda x: x[1], reverse=True)[:5]
            bundles = []
            for pair, count in top_pairs:
                bundles.append({
                    "products": list(pair),
                    "times_bought_together": count,
                    "suggestion": f"'{pair[0]}' and '{pair[1]}' have been bought together {count} time{'s' if count > 1 else ''}. Consider offering them as a bundle.",
                })
            return {
                "enough_data": True,
                "rules": [],
                "recommendations": {},
                "bundles": bundles,
                "note": "Not enough repeated combinations for strong rules yet, but here are your most common product pairs.",
            }

        return {
            "enough_data": True,
            "rules": [],
            "recommendations": {},
            "bundles": [],
            "note": "Most orders contain single items. No strong product associations found yet.",
        }

    # Build per-product recommendation map
    recommendations = defaultdict(list)
    for rule in rules[:20]:  # Top 20 rules max
        pct = round(rule["confidence"] * 100)
        strength = "strongly" if rule["lift"] > 2 else "often"
        recommendations[rule["antecedent"]].append({
            "product": rule["consequent"],
            "confidence": rule["confidence"],
            "lift": rule["lift"],
            "plain_english": f"Customers who buy '{rule['antecedent']}' {strength} also buy '{rule['consequent']}' ({pct}% of the time).",
        })

    # Build bundle suggestions
    bundles = []
    seen_pairs = set()
    for rule in rules[:8]:
        pair_key = tuple(sorted([rule["antecedent"], rule["consequent"]]))
        if pair_key not in seen_pairs:
            seen_pairs.add(pair_key)
            pct = round(rule["confidence"] * 100)
            bundles.append({
                "products": [rule["antecedent"], rule["consequent"]],
                "confidence": rule["confidence"],
                "lift": rule["lift"],
                "suggestion": f"Bundle '{rule['antecedent']}' with '{rule['consequent']}' — {pct}% of customers who buy one also buy the other.",
            })

    # Format rules for API response
    formatted_rules = []
    for rule in rules[:15]:
        pct = round(rule["confidence"] * 100)
        formatted_rules.append({
            **rule,
            "plain_english": f"When a customer buys '{rule['antecedent']}', there is a {pct}% chance they also buy '{rule['consequent']}' (lift: {rule['lift']}x).",
        })

    return {
        "enough_data": True,
        "total_transactions": len(baskets),
        "rules": formatted_rules,
        "recommendations": dict(recommendations),
        "bundles": bundles,
    }