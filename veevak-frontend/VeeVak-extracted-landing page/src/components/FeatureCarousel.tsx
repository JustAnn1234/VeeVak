import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Store, TrendingUp, ShoppingBag, BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: MessageCircle, title: "Extract sales from chats", desc: "Turn conversations into data" },
  { icon: Store, title: "Track offline sales", desc: "Log offline sales easily" },
  { icon: TrendingUp, title: "Revenue over time", desc: "See your earnings trend" },
  { icon: ShoppingBag, title: "Best-selling products", desc: "Know what moves fastest" },
  { icon: BarChart2, title: "Platform performance", desc: "Compare sales channels" },
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4, ease: "easeOut" as const },
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return prev === features.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? features.length - 1 : prev - 1;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const feature = features[currentIndex];
  const Icon = feature.icon;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main carousel area */}
      <div className="relative h-48 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full cursor-grab active:cursor-grabbing"
          >
            <div className="card-elevated text-center mx-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(-1)}
          className="h-10 w-10 rounded-full border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        {/* Dots indicator */}
        <div className="flex gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(1)}
          className="h-10 w-10 rounded-full border border-border"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Swipe hint */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Swipe or use arrows to explore
      </p>
    </div>
  );
};

export default FeatureCarousel;
