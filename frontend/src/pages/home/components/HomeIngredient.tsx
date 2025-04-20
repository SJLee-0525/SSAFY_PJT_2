import "@pages/home/Home.css";

import { useState, useEffect } from "react";

import useIngredientsStore from "@stores/ingredientsStore.ts";
import useModalStore from "@stores/modalStore";

import { calculateDaysRemaining } from "@utils/getFormattedDate";

import { Ingredients } from "@/types/ingredientsTypes";

import DetailIngredientModal from "@pages/detailIngredient/DetailIngredientModal";

import IconDecrease from "@assets/icons/IconDecrease";
import IconIncrease from "@assets/icons/IconIncrease";

import noImg from "@assets/images/noIngredient/noIngredient.jpg";

const HomeIngredient = ({ ingredient }: { ingredient: Ingredients }) => {
  const { selectedIngredients, setSelectedCount } = useIngredientsStore();
  const { openModal } = useModalStore();

  const selectedIngredient = selectedIngredients[ingredient.ingredientInfoId];

  const [count, setCount] = useState<number>(selectedIngredient?.selectedCount || 0);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const daysRemaining = calculateDaysRemaining(ingredient.earliestExpiration);

  useEffect(() => {
    setCount(selectedIngredients[ingredient.ingredientInfoId]?.selectedCount || 0);
  }, [selectedIngredients]);

  function handleIncrease(): void {
    if (count < ingredient.totalCount) {
      setCount(count + 1);
      setSelectedCount(ingredient.ingredientInfoId, {
        ingredientInfoId: ingredient.ingredientInfoId,
        name: ingredient.name,
        imageUrl: ingredient.imageUrl,
        selectedCount: count + 1,
      });
    }
  }

  function handleDecrease(): void {
    if (count > 0) {
      setCount(count - 1);
      setSelectedCount(ingredient.ingredientInfoId, {
        ingredientInfoId: ingredient.ingredientInfoId,
        name: ingredient.name,
        imageUrl: ingredient.imageUrl,
        selectedCount: count - 1,
      });
    }
  }

  function triggerShake(): void {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  }

  return (
    <div className="flex flex-col w-full h-fit p-1 justify-center items-center ">
      {/* 아이콘 부분 */}
      <div
        className={`relative w-full aspect-[1/1] rounded-3xl cursor-pointer ${isShaking ? "shake" : ""}`}
        onClick={() => openModal(<DetailIngredientModal ingredientId={ingredient.ingredientInfoId} />)}
      >
        {/* 재료 이미지 */}
        <img
          src={ingredient.imageUrl ? ingredient.imageUrl : noImg}
          alt="no image"
          onError={(event) => (event.currentTarget.src = noImg)}
          className="w-full aspect-[1/1] object-cover rounded-3xl"
        />

        {/* 재료 이름 출력 */}
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent rounded-b-3xl" />
        <p
          className="absolute bottom-0.5 w-full font-preMedium text-xs text-center text-white"
          style={{
            textShadow: "0.5px 0 black, 0 0.5px black, -0.5px 0 black, 0 -0.5px black",
          }}
        >
          {ingredient.name}
        </p>

        {/* 만료일 임박 / 초과 표시 */}
        {2 > daysRemaining && <span className="absolute top-0 left-0 w-[5px] aspect-[1/1] bg-error rounded-full" />}

        {/* 선택된 개수 카운트 */}
        {count > 0 && (
          <span className="absolute flex justify-center items-center right-0 top-0 bg-orange-500 w-6 h-6 rounded-full cursor-pointer">
            <p className="font-preSemiBold text-white text-sm">{count}</p>
          </span>
        )}
      </div>

      {/* 재료 조작 관련 부분 */}
      <div className="flex w-full h-8 justify-between items-center p-0.5">
        <button
          onClick={count <= 0 ? triggerShake : handleDecrease}
          className="flex justify-center items-center w-3.5 aspect-[1/1] p-[2px] bg-[#cccccc] rounded-full"
        >
          <IconDecrease strokeColor="white" strokeWidth={6} />
        </button>
        <span className="font-preMedium text-center text-sm">
          {ingredient.totalCount - count <= 99 ? ingredient.totalCount - count : "99+"}
        </span>
        <button
          onClick={count >= ingredient.totalCount ? triggerShake : handleIncrease}
          className="flex justify-center items-center w-3.5 aspect-[1/1] p-[2px] bg-[#cccccc] rounded-full"
        >
          <IconIncrease strokeColor="white" strokeWidth={6} />
        </button>
      </div>
    </div>
  );
};

export default HomeIngredient;
