import { motion } from "framer-motion";
import { Heart, Shield, Users, CheckCircle, TrendingUp } from "lucide-react";

const values = [
  { icon: Heart, title: "Human-first technology" },
  { icon: Shield, title: "Responsible use of AI" },
  { icon: Users, title: "Building for real-world behavior" },
  { icon: CheckCircle, title: "Accessibility over complexity" },
  { icon: TrendingUp, title: "Empowering small businesses" },
];

const ValuesMarquee = () => {
  // Double the items for seamless loop
  const duplicatedValues = [...values, ...values];

  return (
    <div className="relative overflow-hidden py-4">
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -50 * values.length * 4],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {duplicatedValues.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-card rounded-full shadow-soft border border-border/50"
            >
              <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center">
                <Icon className="w-4 h-4 text-teal" />
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {item.title}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ValuesMarquee;
