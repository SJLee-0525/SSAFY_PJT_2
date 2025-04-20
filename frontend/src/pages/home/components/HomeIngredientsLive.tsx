import { useEffect, useState, useRef } from "react";
import useIngredientsStore from "@stores/ingredientsStore.ts";
import HomeIngredient from "@pages/home/components/HomeIngredient.tsx";
import Hammer from "hammerjs";

const ITEM_PER_PAGE = 25;

const HomeIngredients = ({ isFilterOpen }: { isFilterOpen: boolean }) => {
  const { ingredients } = useIngredientsStore();

  const [pageIndex, setPageIndex] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageIndex(0);
  }, [ingredients]);

  const totalPages = ingredients?.length > 0 ? Math.ceil(ingredients.length / ITEM_PER_PAGE) : 1;
  const pagination = Array.from({ length: totalPages });

  function handlePrevPage() {
    setPageIndex((page) => Math.max(page - 1, 0));
  }

  function handleNextPage() {
    setPageIndex((page) => Math.min(page + 1, totalPages - 1));
  }

  useEffect(() => {
    if (!containerRef.current) return;

    const hammer = new Hammer(containerRef.current);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("panmove", (e) => {
      setDeltaX(e.deltaX);
    });

    hammer.on("panend", (e) => {
      if (e.deltaX < -50 && pageIndex < totalPages - 1) {
        handleNextPage();
      } else if (e.deltaX > 50 && pageIndex > 0) {
        handlePrevPage();
      }
      setDeltaX(0);
    });

    return () => {
      hammer.destroy();
    };
  }, [pageIndex, totalPages]);

  if (ingredients && ingredients.length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="font-preSemiBold text-lg text-content">등록된 재료가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isFilterOpen && <div className="absolute inset-0 w-full h-full bg-transparent pointer-events-auto z-20" />}

      <div
        ref={containerRef}
        className="flex flex-col justify-between items-center w-full h-full py-2 overflow-hidden"
      >
        <div
          className="flex justify-between items-start w-full h-[95%] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(-${pageIndex * 100}% + ${deltaX}px))` }}
        >
          {pagination.map((_, idx) => {
            const startIdx = idx * ITEM_PER_PAGE;
            const endIdx = startIdx + ITEM_PER_PAGE;
            return (
              <div key={idx} className="w-[90%] mx-[5%] flex-shrink-0 grid grid-cols-5 gap-2">
                {ingredients.slice(startIdx, endIdx).map((ingredient) => (
                  <HomeIngredient key={ingredient.ingredientInfoId} ingredient={ingredient} />
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-1.5 h-[5%]">
          {pagination.map((_, idx) => (
            <span
              key={idx}
              className={`rounded-full transition-all aspect-[1/1] ${
                idx === pageIndex ? "w-2 h-2 bg-primary" : "w-1.5 h-1.5 bg-content"
              }`}
              onClick={() => setPageIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeIngredients;
