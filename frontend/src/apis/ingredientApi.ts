import {
  Ingredients,
  IngredientsSearchInfo,
  StoreIngredient,
  StoreResponseIngredient,
  IngredientNutrition,
  DeleteIngredient,
  DeleteIngredientResponse,
} from "@/types/ingredientsTypes";

import instance from "./instance";

// 고내에 저장된 재료 목록 조회
export const getIngredientsApi = async (location: string, sort: string, order: string): Promise<Ingredients[]> => {
  try {
    const response = await instance.get(`/v1/ingredient?storage=${location}&sort=${sort}&order=${order}`);
    // console.log(`v1/ingredient?storage=${location}&sort=${sort}&order=${order}`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 자동완성 검색
export const searchIngredientsApi = async (inputValue: string): Promise<IngredientsSearchInfo[]> => {
  try {
    const response = await instance.get(`/v1/ingredient/search?req=${inputValue}`);
    // console.log(`v1/ingredient/search?req=${inputValue}`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 입고
export const storeIngredientApi = async (ingredient: StoreIngredient): Promise<StoreResponseIngredient> => {
  try {
    const response = await instance.post("/v1/ingredient", ingredient);
    // console.log("v1/ingredient (post)", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 상세 조회 (영양 정보)
export const getIngredientNutritionApi = async (ingredientId: number): Promise<IngredientNutrition> => {
  try {
    const response = await instance.get(`/v1/ingredient/nutrient/${ingredientId}`);
    // console.log("v1/ingredient/nutrient", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

// 재료 삭제
export const deleteIngredientApi = async (ingredients: DeleteIngredient[]): Promise<DeleteIngredientResponse> => {
  try {
    const response = await instance.delete("/v1/ingredient/release", { data: ingredients });
    // console.log("v1/ingredient/release", response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
