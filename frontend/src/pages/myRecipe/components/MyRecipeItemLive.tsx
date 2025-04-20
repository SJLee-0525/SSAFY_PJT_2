import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@stores/userStore";
import { PagenationRecipeInfo } from "@/types/recipeListTypes";
import VideoInfoRows from "@components/common/videoInfo/VideoInfoRows";
import RatingInfos from "@pages/myRecipe/components/RatingInfos";
import { patchRecipeApi } from "@apis/recipeApi";
import Hammer from "hammerjs";

const MyRecipeItem = ({
  currentPage,
  numberOfElements,
  type,
  recipe,
  onDelete,
}: {
  currentPage: number;
  numberOfElements: number;
  type: "favorite" | "rating";
  recipe: PagenationRecipeInfo;
  onDelete: (pageNumber: number) => void;
}) => {
  const navigate = useNavigate();
  const { userId } = useUserStore();

  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const hammer = new Hammer(containerRef.current);
    hammer.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammer.on("panstart", (e) => {
      startX.current = e.deltaX;
    });

    hammer.on("panmove", (e) => {
      const diff = e.deltaX - startX.current;
      if (diff < 0) {
        setTranslateX(Math.max(diff, -80));
      } else if (diff > 0) {
        setTranslateX(Math.min(diff, 0));
      }
    });

    hammer.on("panend", () => {
      setTranslateX((current) => (current < -50 ? -80 : 0));
    });

    return () => {
      hammer.destroy();
    };
  }, []);


  async function handleDelete(recipe: PagenationRecipeInfo) {
    try {
      if (type === "favorite") {
        await patchRecipeApi(userId, recipe.recipeId, 0, false);
        onDelete(numberOfElements > 1 || currentPage === 1 ? currentPage : currentPage - 1);
      } else {
        await patchRecipeApi(userId, recipe.recipeId, -1);
        onDelete(numberOfElements > 1 || currentPage === 1 ? currentPage : currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  }

  return (
    <div
      ref={containerRef}
      key={recipe.recipeId}
      className="relative w-[90%] h-24 bg-white rounded-xl shadow-md overflow-hidden"
    >
      <button
        onClick={() => handleDelete(recipe)}
        className="absolute right-0 top-0 h-full px-4 bg-error font-preSemiBold text-white transition-all duration-200"
        style={{
          transform: `translateX(${Math.min(translateX + 80, 80)}px)`,
          opacity: Math.min(Math.abs(translateX) / 80, 1),
        }}
      >
        삭제
      </button>

      <div
        className="flex flex-col justify-between items-start w-full h-full px-6 py-4 gap-4 transition-transform duration-200 cursor-pointer"
        style={{ transform: `translateX(${translateX}px)` }}
        onClick={() => navigate(`/detailRecipe/${recipe.recipeId}`)}
      >
        <p className="w-[80%] font-preBold text-md overflow-hidden text-ellipsis whitespace-nowrap">
          {recipe.title}
        </p>
        <div className="flex justify-between items-center w-full">
          <VideoInfoRows duration={recipe.duration} likeCount={recipe.likeCount} viewCount={recipe.viewCount} />
          <RatingInfos favorite={recipe.favorite} rating={recipe.rating} />
        </div>
      </div>
    </div>
  );
};

export default MyRecipeItem;