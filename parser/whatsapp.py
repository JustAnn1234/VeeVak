import re
from typing import List, Dict


def parse_whatsapp_export(file_content: str) -> List[Dict]:
    """
    Parse a WhatsApp .txt export into structured messages.
    Handles the common WhatsApp export format:
    [DD/MM/YYYY, HH:MM:SS] Name: Message
    """
    pattern = r'\[(\d{1,2}/\d{1,2}/\d{4}),\s(\d{1,2}:\d{2}(?::\d{2})?)\s?(?:AM|PM)?\]\s([^:]+):\s(.+)'

    messages = []
    current = None

    for line in file_content.split('\n'):
        match = re.match(pattern, line)
        if match:
            if current:
                messages.append(current)
            date_str, time_str, sender, content = match.groups()
            current = {
                "date": date_str.strip(),
                "time": time_str.strip(),
                "sender": sender.strip(),
                "content": content.strip(),
                "is_owner": False
            }
        elif current and line.strip():
            current["content"] += f" {line.strip()}"

    if current:
        messages.append(current)

    return messages


def identify_owner(messages: List[Dict], owner_name: str = "") -> List[Dict]:
    """
    Mark which messages belong to the business owner.

    Strategy, in order of priority:
    1. If the seller typed their own name/handle, match that exactly (existing behavior).
    2. Common business-side labels like "you", "me", "customer service", "admin", "store" etc.
    3. Fallback: if the chat has exactly two unique senders (the overwhelmingly common
       case for a single customer DM thread), treat whichever sender appears FIRST as
       the business — sellers almost always send the opening greeting.
    """
    owner_identifiers = {"you", "me", "customer service", "admin", "support", "store"}
    if owner_name:
        owner_identifiers.add(owner_name.lower().strip())

    unique_senders = []
    for msg in messages:
        if msg["sender"] not in unique_senders:
            unique_senders.append(msg["sender"])

    # Fallback only kicks in for a clean two-party thread where no explicit match was made.
    matched_any = any(m["sender"].lower() in owner_identifiers for m in messages)
    if not matched_any and len(unique_senders) == 2:
        owner_identifiers.add(unique_senders[0].lower())

    for msg in messages:
        if msg["sender"].lower() in owner_identifiers:
            msg["is_owner"] = True
    return messages


def group_into_conversations(messages: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Group messages by customer thread.

    A WhatsApp export of a single DM conversation has exactly one non-owner sender;
    if that's the case here, treat the entire export as one conversation regardless
    of message order, rather than re-bucketing by sender name (which can misfire on
    edge cases like a customer signing their own name mid-chat, e.g. "Name: Amara Okafor").
    """
    non_owner_senders = set()
    for msg in messages:
        if not msg["is_owner"]:
            non_owner_senders.add(msg["sender"])

    if len(non_owner_senders) <= 1:
        customer = next(iter(non_owner_senders), "Customer")
        return {customer: messages}

    # Multiple distinct customers in one export (e.g. a bulk-exported group or merged file):
    # fall back to per-sender grouping, attaching owner replies to the most recently active customer.
    conversations = {}
    last_customer = None
    for msg in messages:
        if not msg["is_owner"]:
            customer = msg["sender"]
            conversations.setdefault(customer, []).append(msg)
            last_customer = customer
        elif last_customer:
            conversations[last_customer].append(msg)

    return conversations


def clean_text(text: str) -> str:
    """Basic cleanup before sending text to the LLM."""
    text = re.sub(r'<Media omitted>', '[image/voice note]', text)
    text = re.sub(r'\[image omitted\]', '[image]', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def build_conversation_text(messages: List[Dict]) -> str:
    """Turn a list of messages into a readable transcript for the LLM."""
    lines = []
    for m in messages:
        speaker = "Owner" if m["is_owner"] else m["sender"]
        lines.append(f"{speaker}: {clean_text(m['content'])}")
    return "\n".join(lines)