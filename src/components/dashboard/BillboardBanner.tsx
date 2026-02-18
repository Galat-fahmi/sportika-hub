import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

const BillboardBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample sports images - replace with your actual image paths
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&h=400&fit=crop&crop=center",
      alt: "Athlete in action"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1534103362078-d07e750bd0c4?w=1200&h=400&fit=crop&crop=center",
      alt: "Sports competition"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop&crop=center",
      alt: "Professional athlete"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl bg-card shadow-lg border border-border/20">
      {/* Slides */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/15" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-0 text-white backdrop-blur-sm transition-all hover:scale-105 shadow-md"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-0 text-white backdrop-blur-sm transition-all hover:scale-105 shadow-md"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all hover:scale-110 focus:outline-none p-1"
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentIndex ? (
              <CircleDot className="h-4 w-4 text-white drop-shadow-lg" />
            ) : (
              <Circle className="h-4 w-4 text-white/70 hover:text-white/90 drop-shadow-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BillboardBanner;