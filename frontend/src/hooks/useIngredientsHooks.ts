import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Ingredients,
  StoreIngredient,
  StoreResponseIngredient,
  IngredientNutrition,
  DeleteIngredient,
  DeleteIngredientResponse,
} from "@/types/ingredientsTypes";

import {
  getIngredientsApi,
  storeIngredientApi,
  getIngredientNutritionApi,
  deleteIngredientApi,
} from "@apis/ingredientApi";

import useIngredientsStore from "@stores/ingredientsStore";
import useUserStore from "@stores/userStore";

// 고내에 저장된 재료 목록 조회
export const useGetIngredientsList = (location: string, sort: string, order: string) => {
  const { setIngredients } = useIngredientsStore();
  const { isAuthenticated } = useUserStore();

  const query = useQuery<Ingredients[]>({
    queryKey: ["ingredients", location, sort, order],
    queryFn: () => {
      if (!isAuthenticated) {
        return []; // 인증되지 않은 경우 빈 배열 반환
      }
      return getIngredientsApi(location, sort, order);
    },
    staleTime: 1000 * 60 * 60 * 8, // 8시간
    throwOnError: true,
  });

  useEffect(() => {
    if (query.data) {
      setIngredients(query.data);
    }
  }, [query.data, setIngredients]);

  return query;
};

// 재료 입고
export const useStoreIngredient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<StoreResponseIngredient, Error, StoreIngredient>({
    mutationFn: storeIngredientApi, // 재료 저장 API 호출
    onSuccess: () => {
      // 저장 성공 시, 기존 재료 목록을 무효화하여 자동으로 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      console.error("재료 저장 실패:", error);
    },
  });

  return mutation;
};

// 영양 정보 조회
export const useGetIngredientNutrition = (ingredientId: number, enabled: boolean) => {
  const query = useQuery<IngredientNutrition>({
    queryKey: ["ingredientNutrition", ingredientId],
    queryFn: () => getIngredientNutritionApi(ingredientId),
    enabled,
    throwOnError: true,
  });

  return query;
};

// 재료 삭제
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteIngredientResponse, Error, DeleteIngredient[]>({
    mutationFn: deleteIngredientApi, // 재료 삭제 API 호출
    onSuccess: () => {
      // 삭제 성공 시, 기존 재료 목록을 무효화하여 자동으로 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      console.error("재료 삭제 실패:", error);
    },
  });

  return mutation;
};
