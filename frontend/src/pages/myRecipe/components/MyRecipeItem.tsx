import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUserStore from "@stores/userStore";

import { PagenationRecipeInfo } from "@/types/recipeListTypes";

import VideoInfoRows from "@components/common/videoInfo/VideoInfoRows";
import RatingInfos from "@pages/myRecipe/components/RatingInfos";

import { patchRecipeApi } from "@apis/recipeApi";

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

  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  function handleTouchStart(event: React.TouchEvent) {
    setStartX(event.touches[0].clientX);
  }

  function handleTouchMove(event: React.TouchEvent) {
    const moveX = event.touches[0].clientX;
    const diff = moveX - startX;

    if (diff < 0) {
      setTranslateX(Math.max(diff, -80));
    } else if (diff > 0) {
      setTranslateX(Math.min(diff, 0)); // 오른쪽으로 이동할 때는 원래 위치로 복귀
    }
  }

  function handleTouchEnd() {
    // 50px 이상 스와이프하면 고정, 아니면 원래 위치로 복귀
    if (translateX < -50) {
      setTranslateX(-80);
    } else {
      setTranslateX(0);
    }
  }

  async function handleDelete(recipe: PagenationRecipeInfo) {
    try {
      if (type === "favorite") {
        // 즐겨찾기 삭제
        await patchRecipeApi(userId, recipe.recipeId, 0, false);

        // 삭제 후 페이지 갱신
        // (currentPage가 1이거나 지워도 목록 개수가 1개 이상이면 페이지를 유지하고, 아니면 이전 페이지로 이동)
        onDelete(numberOfElements > 1 || currentPage === 1 ? currentPage : currentPage - 1);
      } else {
        // 평점(기록) 삭제
        await patchRecipeApi(userId, recipe.recipeId, -1);

        // 삭제 후 페이지 갱신
        onDelete(numberOfElements > 1 || currentPage === 1 ? currentPage : currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    }
  }

  return (
    <div
      key={recipe.recipeId}
      className="relative w-[90%] h-24 bg-white rounded-xl shadow-md overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 삭제 버튼  */}
      <button
        onClick={() => handleDelete(recipe)}
        className="absolute right-0 top-0 h-full px-4 bg-error font-preSemiBold text-white transition-all duration-200"
        style={{
          transform: `translateX(${Math.min(translateX + 80, 80)}px)`,
          opacity: Math.min(Math.abs(translateX) / 80, 1), // 80px 이동할 때 100% 투명도
        }}
      >
        삭제
      </button>

      {/* 레시피 아이템 */}
      <div
        className="flex flex-col justify-between items-start w-full h-full px-6 py-4 gap-4 transition-transform duration-200 cursor-pointer"
        style={{ transform: `translateX(${translateX}px)` }}
        onClick={() => navigate(`/detailRecipe/${recipe.recipeId}`)}
      >
        <p className="w-[80%] font-preBold text-md overflow-hidden text-ellipsis whitespace-nowrap">{recipe.title}</p>
        <div className="flex justify-between items-center w-full">
          <VideoInfoRows duration={recipe.duration} likeCount={recipe.likeCount} viewCount={recipe.viewCount} />
          <RatingInfos favorite={recipe.favorite} rating={recipe.rating} />
        </div>
      </div>
    </div>
  );
};

export default MyRecipeItem;
