import { useEffect, useMemo, useRef, useState } from "react";
import { Video, VideoList } from "@/types/recipeListTypes";
import RecipeCard from "@pages/recipeList/components/RecipeCard";
import Hammer from "hammerjs";

interface RecipeCarouselProps {
  selectedDish: keyof VideoList | string;
  videos: Video[];
}

const RecipeCarousel = ({ selectedDish, videos }: RecipeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [deltaX, setDeltaX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function goToPrevious() {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  }

  function goToNext() {
    setCurrentIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  }

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDish]);

  useEffect(() => {
    if (!containerRef.current) return;

    const hammer = new Hammer(containerRef.current);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("panmove", (e) => {
      setDeltaX(e.deltaX);
    });

    hammer.on("panend", (e) => {
      if (e.deltaX < -50) goToNext();
      else if (e.deltaX > 50) goToPrevious();
      setDeltaX(0);
    });

    return () => {
      hammer.destroy();
    };
  }, [currentIndex, videos.length]);

  const carouselItems = useMemo(() => {
    return videos.map((video) => (
      <div key={video.recipeId} className="w-full flex-shrink-0">
        <RecipeCard video={video} />
      </div>
    ));
  }, [videos]);

  const pagingItems = useMemo(() => {
    return videos.map((video, index) => (
      <div
        key={video.recipeId}
        className={`rounded-full transition-all aspect-[1/1] ${
          index === currentIndex ? "w-2 h-2 bg-primary" : "w-1.5 h-1.5 bg-content"
        }`}
        onClick={() => setCurrentIndex(index)}
      ></div>
    ));
  }, [videos, currentIndex]);

  return (
    <div className="relative flex flex-col gap-8 justify-center items-center flex-[3]">
      <div className="overflow-hidden w-full" ref={containerRef}>
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${deltaX}px))` }}
        >
          {carouselItems}
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">{pagingItems}</div>
    </div>
  );
};

export default RecipeCarousel;
