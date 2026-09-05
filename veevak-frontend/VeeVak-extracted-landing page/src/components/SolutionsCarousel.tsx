import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiggyBank, Store, Smartphone, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const solutions = [
  { icon: PiggyBank, title: "Accounting software", desc: "Too complex for informal sellers" },
  { icon: Store, title: "POS systems", desc: "Only work for stores with fixed locations" },
  { icon: Smartphone, title: "Ecommerce platforms", desc: "Require full online shops" },
  { icon: MessageCircle, title: "Platform tools", desc: "Locked to a single app" },
];

const SolutionsCarousel = () => {
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
        return prev === solutions.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? solutions.length - 1 : prev - 1;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const solution = solutions[currentIndex];
  const Icon = solution.icon;

  return (
    <div className="relative w-full max-w-md mx-auto bg-primary/10 rounded-2xl p-6">
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
              <div className="w-14 h-14 rounded-full bg-coral-light flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-coral" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{solution.title}</h3>
              <p className="text-sm text-muted-foreground">{solution.desc}</p>
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
          {solutions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-coral w-6"
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

export default SolutionsCarousel;
