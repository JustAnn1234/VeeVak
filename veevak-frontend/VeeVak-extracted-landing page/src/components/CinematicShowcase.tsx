import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import showcaseChatSales from "@/assets/showcase-chat-sales.jpg";
import showcaseDashboard from "@/assets/showcase-dashboard.jpg";
import showcaseHappyOwner from "@/assets/showcase-happy-owner.jpg";
import showcasePlatforms from "@/assets/showcase-platforms.jpg";

const showcaseImages = [
  {
    src: showcaseChatSales,
    alt: "WhatsApp sales conversations being tracked",
    caption: "From chat conversations..."
  },
  {
    src: showcasePlatforms,
    alt: "Multiple platforms connected to analytics",
    caption: "Across all your platforms..."
  },
  {
    src: showcaseDashboard,
    alt: "Business analytics dashboard",
    caption: "Into clear business insights..."
  },
  {
    src: showcaseHappyOwner,
    alt: "Happy business owner viewing insights",
    caption: "Empowering your decisions"
  }
];

export const CinematicShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 4000; // 4 seconds per slide
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / PROGRESS_INTERVAL));
      });
    }, PROGRESS_INTERVAL);

    const slideTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(progressTimer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
            See It In Action
          </span>
          <h2 className="heading-2 text-foreground mb-4">
            The VeeVak Experience
          </h2>
        </motion.div>

        {/* Cinematic Video Container */}
        <motion.div
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Aspect Ratio Container (16:9) */}
          <div className="relative aspect-video bg-muted">
            {/* Progress Bar at Top */}
            <div className="absolute top-0 left-0 right-0 z-20 flex gap-2 p-3">
              {showcaseImages.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-background/30 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-background rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                          ? `${progress}%`
                          : "0%"
                    }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
              ))}
            </div>

            {/* Image Slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <img
                  src={showcaseImages[currentIndex].src}
                  alt={showcaseImages[currentIndex].alt}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`caption-${currentIndex}`}
                className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-xl md:text-3xl font-semibold text-foreground">
                  {showcaseImages[currentIndex].caption}
                </p>
              </motion.div>
            </AnimatePresence>

          </div>
        </motion.div>

        {/* Slide indicators below */}
        <div className="flex justify-center gap-3 mt-6">
          {showcaseImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
