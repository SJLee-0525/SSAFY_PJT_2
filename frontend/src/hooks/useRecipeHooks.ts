import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecipeDetailApi, getRecipeFavoriteApi, getRecipeRatingApi, makeRecipeApi } from "@apis/recipeApi";
import useRecipeStore from "@stores/recipeStore";
import { PaginationRecipeList, RecipeInfo, RecipeList } from "@/types/recipeListTypes";

//선택 재료 기반 레시피 리스트 조회 API 호출
export const usePostRecipeList = (userId: number, ingredients: string[]) => {
  const { setRecipeList } = useRecipeStore();

  // ingredients를 정렬하고 문자열로 변환하여 일관된 queryKey 생성
  const ingredientsKey = ingredients.length > 0 ? ingredients.sort().join(",") : "empty";

  const query = useQuery<RecipeList>({
    queryKey: ["recipeList", ingredientsKey],
    queryFn: () => makeRecipeApi(userId, ingredients),
    staleTime: 1000 * 60 * 20, // 20분
    retry: 1,
  });

  //query 호출 후 데이터 저장
  useEffect(() => {
    if (query.data) {
      setRecipeList(query.data);
    }
  }, [query.data, setRecipeList]);

  return query;
};

//레시피 상세 및 텍스트 추출 API
export const useGetRecipeDetail = (recipeId: number) => {
  const { setDetailRecipe } = useRecipeStore();

  const query = useQuery<RecipeInfo>({
    queryKey: ["recipeDetail", recipeId],
    queryFn: () => getRecipeDetailApi(recipeId),
    retry: false,
  });

  // useEffect로 data 변화 관찰
  useEffect(() => {
    if (query.data) {
      setDetailRecipe(query.data);
    }
  }, [query.data, setDetailRecipe]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    data: query.data,
  };
};

//즐겨찾기 레시피 조회 상태 관리용 query
export const useGetFavoriteRecipe = (userId: number, page: number) => {
  const query = useQuery<PaginationRecipeList>({
    queryKey: ["favoriteRecipe", userId],
    queryFn: () => getRecipeFavoriteApi(userId, page),
    retry: false,
    staleTime: 1000 * 60 * 20, // 20분
    throwOnError: true,
  });

  return {
    isLoading: query.isLoading,
    data: query.data,
    refetch: query.refetch,
  };
};

//이전 레시피 조회 상태 관리용 query
export const useGetRatingRecipe = (userId: number, page: number) => {
  const query = useQuery<PaginationRecipeList>({
    queryKey: ["historyRecipe", userId],
    queryFn: () => getRecipeRatingApi(userId, page),
    retry: false,
    staleTime: 1000 * 60 * 20, // 20분
    throwOnError: true,
  });

  return {
    isLoading: query.isLoading,
    data: query.data,
    refetch: query.refetch,
  };
};
