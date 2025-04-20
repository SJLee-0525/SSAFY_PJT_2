import React, { useEffect, useMemo, useRef, useState } from "react";
import { Video, VideoList } from "@/types/recipeListTypes";
import RecipeCard from "@pages/recipeList/components/RecipeCard";

interface RecipeCarouselProps {
  selectedDish: keyof VideoList | string;
  videos: Video[];
}

const RecipeCarousel = ({ selectedDish, videos }: RecipeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [deltaX, setDeltaX] = useState(0);

  const touchStartX = useRef(0);

  //이전으로
  function goToPrevious() {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  }

  //다음으로
  function goToNext() {
    setCurrentIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  }

  // 터치 이벤트 핸들러
  function handleTouchStart(event: React.TouchEvent) {
    // 터치 시작 지점 저장
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchMove(event: React.TouchEvent) {
    // 터치 이동 거리 계산
    const moveX = event.touches[0].clientX;
    setDeltaX(moveX - touchStartX.current);
  }

  function handleTouchEnd() {
    if (deltaX < -50 && currentIndex < videos.length - 1) {
      // 왼쪽으로 스와이프
      goToNext();
    }

    if (deltaX > 50 && currentIndex > 0) {
      // 오른쪽으로 스와이프
      goToPrevious();
    }

    setDeltaX(0); // 터치 이동 거리 초기화
  }

  const carouselItems = useMemo(() => {
    return (
      videos &&
      videos.map((video) => (
        <div key={video.recipeId} className="w-full flex-shrink-0">
          <RecipeCard video={video} />
        </div>
      ))
    );
  }, [videos]);

  const pagingItems = useMemo(() => {
    return (
      videos &&
      videos.map((video, index) => (
        <div
          key={video.recipeId}
          className={`rounded-full transition-all aspect-[1/1] ${index === currentIndex ? "w-2 h-2 bg-primary" : "w-1.5 h-1.5 bg-content"}`}
          onClick={() => setCurrentIndex(index)}
        ></div>
      ))
    );
  }, [videos, currentIndex]);

  // 새로운 음식 이름 누를 때, index 초기화
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedDish]);

  return (
    <div className="relative flex flex-col gap-8 justify-center items-center flex-[3]">
      <div
        className="overflow-hidden w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems}
        </div>
      </div>

      {/* 페이지 인덱싱 */}
      <div className="flex gap-2 items-center justify-center">{pagingItems}</div>
    </div>
  );
};

export default RecipeCarousel;
