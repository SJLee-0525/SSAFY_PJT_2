import { useNavigate } from "react-router-dom";

import Button from "@components/common/button/Button";

import IconClipboard from "@assets/icons/IconClipboard";

import useRecipeStore from "@stores/recipeStore";

import { useQueryClient } from "@tanstack/react-query";

const NoRecipeList = ({ text }: { text: string }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { resetRecipeSelectedIngredients, resetDetailRecipe, resetRecipeList } = useRecipeStore();

  function goToPrevious() {
    //홈으로 돌아갈 때, 선택된 재료, detailRecipe, recipeList 초기화
    resetRecipeSelectedIngredients();
    resetDetailRecipe();
    resetRecipeList();

    // 캐싱 제거
    queryClient.removeQueries({ queryKey: ["recipeList"] });

    navigate("/");
  }
  return (
    <section className="w-full flex flex-col py-20 px-10 gap-20 items-center justify-around h-full bg-offWhite rounded-2xl">
      <div className="flex flex-col gap-8 items-center justify-center">
        <IconClipboard width={120} height={120} />
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl font-preBold">{text} 레시피가 없습니다.</h1>
          <p className="text-base font-preMedium text-content2">잠시 후 다시 시도해 주세요</p>
        </div>
      </div>
      <Button
        type="button"
        design="confirm"
        content="홈으로"
        className="w-[90%] h-10"
        onAction={goToPrevious}
      />
    </section>
  );
};

export default NoRecipeList;
