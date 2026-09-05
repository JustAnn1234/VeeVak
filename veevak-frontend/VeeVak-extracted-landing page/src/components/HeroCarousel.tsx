import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    title: "Turn chat conversations into business insights",
    description: "Millions of small businesses sell every day through chats and offline sales, yet most operate without clear visibility into their sales, customers, or growth.",
  },
  {
    title: "VeeVak exists to change that",
    description: "Simple tools designed for how you actually work. No spreadsheets, no accounting jargon. Just clarity for your business.",
  },
];

interface HeroCarouselProps {
  onJoinWaitlist: () => void;
  onHowItWorks: () => void;
}

const HeroCarousel = ({ onJoinWaitlist, onHowItWorks }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
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
        return prev === heroSlides.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? heroSlides.length - 1 : prev - 1;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentIndex];

  return (
    <div className="relative w-full">
      {/* Main carousel area */}
      <div className="relative min-h-[200px] md:min-h-[180px] flex items-center justify-center overflow-hidden">
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
            className="absolute w-full cursor-grab active:cursor-grabbing text-center px-4"
          >
            <h1 className="heading-1 text-foreground mb-4">
              {slide.title}
            </h1>
            <p className="body-large text-muted-foreground max-w-2xl mx-auto">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(-1)}
          className="h-8 w-8 rounded-full border border-border/50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {/* Dots indicator */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
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
          className="h-8 w-8 rounded-full border border-border/50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default HeroCarousel;
