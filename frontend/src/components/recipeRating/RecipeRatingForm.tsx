import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import useModalStore from "@stores/modalStore";
import useUserStore from "@stores/userStore";
import useRecipeStore from "@stores/recipeStore";

import IconStarBlank from "@assets/icons/IconStarBlank";
import IconStarFill from "@assets/icons/IconStarFill";

import Button from "@components/common/button/Button";

import { patchRecipeApi } from "@apis/recipeApi";

const RecipeRatingForm = () => {
  const navigate = useNavigate();
  const { closeModal } = useModalStore();
  const { recipeId } = useParams();
  const { userId } = useUserStore();
  const { resetRecipeSelectedIngredients, resetDetailRecipe, resetRecipeList, recipeSelectedIngredients } =
    useRecipeStore();

  const selectedIngredientsNames = recipeSelectedIngredients.map((ingredient) => ingredient.name);

  const queryClient = useQueryClient();

  const [rating, setRating] = useState<boolean[]>([true, true, true, true, true]);

  function starRating(index: number) {
    const newRating = [...rating];

    newRating.forEach((_, idx) => {
      newRating[idx] = idx <= index ? true : false;
    });

    setRating(newRating);
  }

  function handleSaveRating() {
    const ratingNumber = rating.filter((star) => star === true).length;

    //레시피 저장 API 호출
    patchRecipeApi(userId, Number(recipeId), ratingNumber);

    //레시피 관련 store, 캐싱 제거
    resetRecipeSelectedIngredients();
    resetDetailRecipe();
    resetRecipeList();

    // 캐싱 제거
    queryClient.invalidateQueries({ queryKey: ["recipeList", selectedIngredientsNames] });
    queryClient.invalidateQueries({ queryKey: ["historyRecipe", userId] });

    closeModal();
    navigate("/");
  }

  return (
    <div className="py-6 flex flex-col items-center gap-10">
      <div className="flex gap-3 py-10">
        {rating &&
          rating.map((el, index) =>
            el ? (
              <button onClick={() => starRating(index)} key={index}>
                <IconStarFill key={index} width={45} height={45} />
              </button>
            ) : (
              <button onClick={() => starRating(index)} key={index}>
                <IconStarBlank width={45} height={45} />
              </button>
            )
          )}
      </div>
      <div className="flex gap-2">
        <Button type="button" design="cancel" content="취소하기" className="w-24 h-10" onAction={closeModal} />
        <Button type="button" design="confirm" content="저장하기" className="w-24 h-10" onAction={handleSaveRating} />
      </div>
    </div>
  );
};

export default RecipeRatingForm;
