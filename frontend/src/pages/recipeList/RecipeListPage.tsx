import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryClient } from "@tanstack/react-query";

import RecipeList from "@pages/recipeList/components/RecipeList";
import NoRecipeList from "@pages/recipeList/components/NoRecipeList";
import SelectedIngredients from "@pages/recipeList/components/RecipeListSelectedIngredients";

import Header from "@components/Layout/Header";
import ErrorPage from "@components/common/error/ErrorPage";
import LoadingPlayer from "@components/common/loading/LoadingPlayer";

import { usePostRecipeList } from "@hooks/useRecipeHooks";

import useRecipeStore from "@stores/recipeStore";
import useUserStore from "@stores/userStore";

const RecipeListPage = () => {
  const { recommendType } = useParams();
  const { userId } = useUserStore();
  const { recipeSelectedIngredients, recipeList, resetRecipeSelectedIngredients, resetDetailRecipe, resetRecipeList } =
    useRecipeStore();

  const queryClient = useQueryClient();

  const [DISHES, setDISHES] = useState<string[]>([]);

  const HeaderTitle = recommendType === "AI" ? "AI 레시피" : "레시피";

  //선택된 재료 기반 레시피 조회 Hook 호출
  const selectedIngredientsNames = recipeSelectedIngredients.map((ingredient) => ingredient.name);
  const { isLoading, isFetching, isError, data } = usePostRecipeList(userId, selectedIngredientsNames);

  //레시피 추출 시 DISHES 상태 업데이트
  useEffect(() => {
    if (recipeList.dishes.length > 0) {
      setDISHES(recipeList.dishes);
    } else {
      setDISHES([]);
    }
  }, [recipeList]);

  function goToPrevious() {
    //홈으로 돌아갈 때, 선택된 재료, detailRecipe, recipeList 초기화
    resetRecipeSelectedIngredients();
    resetDetailRecipe();
    resetRecipeList();

    // 캐싱 제거
    queryClient.removeQueries({ queryKey: ["recipeList"] });
  }

  if (isLoading || isFetching || !data) return <LoadingPlayer />;
  if (isError) return <ErrorPage />;

  return (
    <section className="flex flex-col h-full p-3">
      {DISHES.length > 0 ? (
        <>
          <Header title={HeaderTitle} isIcon onClick={goToPrevious} />
          <div className="flex-1 overflow-auto relative">
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <RecipeList DISHES={DISHES} />
            </ErrorBoundary>
          </div>
          <SelectedIngredients />
        </>
      ) : (
        <NoRecipeList text="생성된" />
      )}
    </section>
  );
};

export default RecipeListPage;
