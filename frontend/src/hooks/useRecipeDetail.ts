import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import useRecipeStore from "@stores/recipeStore";

const useRecipeDetail = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [qrIsOpen, setQrIsOpen] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);

  const { detailRecipe, resetDetailRecipe, setHasFetchedDetailRecipe } = useRecipeStore();

  // 레시피 타이머 추출
  const [recipeTimers, setRecipeTimers] = useState<{ step: string; timer: number }[]>([]);

  function toRecipeList() {
    resetDetailRecipe();
    setHasFetchedDetailRecipe(false);
  }

  // 레시피에서 타이머 정보 추출
  useEffect(() => {
    if (!detailRecipe.textRecipe) return;

    const timers: { step: string; timer: number }[] = [];

    detailRecipe.textRecipe.cooking_sequence &&
      Object.entries(detailRecipe.textRecipe.cooking_sequence).forEach(([key, value]) => {
        if (value.timer > 0) {
          timers.push({
            step: key,
            timer: value.timer,
          });
        }
      });

    setRecipeTimers(timers);
  }, [detailRecipe.textRecipe]);

  return {
    currentTime,
    setCurrentTime,
    qrIsOpen,
    setQrIsOpen,
    playerRef,
    recipeTimers,
    detailRecipe,
    toRecipeList,
  };
};

export default useRecipeDetail;
