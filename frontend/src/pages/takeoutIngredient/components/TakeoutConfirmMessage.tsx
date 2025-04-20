import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useModalStore from "@stores/modalStore";
import useIngredientsStore from "@stores/ingredientsStore";
import useRecipeStore from "@stores/recipeStore";

import Button from "@components/common/button/Button";

import { SelectedIngredients } from "@/types/ingredientsTypes";

const TakeoutConfirmMessage = () => {
  const navigate = useNavigate();

  const { closeModal } = useModalStore();
  const { selectedIngredients, setClearSelectedIngredients } = useIngredientsStore();
  const { setRecipeSelectedIngredients } = useRecipeStore();

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 컴포넌트가 언마운트 되었을 때 clear
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      handleCloseModal();
    }
  }, [countdown, handleCloseModal]);

  function handleCloseModal(): void {
    setClearSelectedIngredients();
    closeModal();
  }

  function handleRecipeRecommendation(): void {
    //selectedIngredients 를 recipeSelectedIngredients 에 저장
    let arraySelectedIngredients: SelectedIngredients[] = [];

    Object.values(selectedIngredients).forEach((ingredient) => {
      arraySelectedIngredients.push(ingredient);
    });

    setRecipeSelectedIngredients(arraySelectedIngredients);

    //selectedIngredients 초기화
    setClearSelectedIngredients();

    //레시피 추천 페이지로 이동
    navigate("/recipeList/ingredient");

    //모달 닫기
    closeModal();
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex flex-col w-full items-center px-4 py-10 font-preMedium">
        <p className="m-0">재료 출고가 완료되었습니다.</p>
        <p className="m-0">{countdown}초 뒤 자동으로 홈으로 이동합니다.</p>
      </div>
      <div className="flex flex-col w-full justify-between items-center font-preRegular gap-2">
        <Button
          type="button"
          design="cancel"
          onAction={handleCloseModal}
          content="홈으로 돌아가기"
          className="w-full h-10"
        />
        <Button
          type="button"
          design="confirm"
          onAction={handleRecipeRecommendation}
          content="출고 재료로 레시피 추천 받기"
          className="w-full h-10"
        />
      </div>
    </div>
  );
};

export default TakeoutConfirmMessage;
