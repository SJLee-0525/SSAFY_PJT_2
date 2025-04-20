import { RecipeInfo, RecipeList, PaginationRecipeList } from "@/types/recipeListTypes";
import instance from "./instance";

//재료 기반 요리이름 생성 및 레시피 리스트 조회 API
export const makeRecipeApi = async (userId: number, ingredients: string[]): Promise<RecipeList> => {
  try {
    const response = await instance.post("/v1/recipe", {
      memberId: userId,
      ingredients: ingredients,
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//단일 레시피 조회 API
export const getRecipeDetailApi = async (recipeId: number): Promise<RecipeInfo> => {
  try {
    const response = await instance.get(`/v1/recipe/${recipeId}/check`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//특정 레시피 텍스트 추출 API
export const getRecipeTextApi = async (recipeId: number): Promise<RecipeInfo> => {
  try {
    const response = await instance.get(`/v1/recipe/${recipeId}`);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//레시피 평가 및 즐겨찾기 API
export const patchRecipeApi = async (memberId: number, recipeId: number, rating?: number, favorite?: boolean) => {
  const reqBody =
    rating === 0
      ? {
          memberId: memberId,
          favorite: favorite,
        }
      : {
          memberId: memberId,
          rating: rating === -1 ? 0 : rating,
        };
  try {
    const response = await instance.patch(`/v1/member/recipe/${recipeId}`, reqBody);
    // console.log(`/v1/member/recipe/${recipeId}`, reqBody, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//사용자가 별점을 준 레시피 (과거) 조회 API
export const getRecipeRatingApi = async (memberId: number, page: number): Promise<PaginationRecipeList> => {
  try {
    const response = await instance.get(`/v1/member/recipe/${memberId}/ratings?page=${page}&sort=createdAt,desc`);
    // console.log(`/v1/member/recipe/${memberId}/ratings?page=${page}`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};

//사용자가 즐겨찾기 한 레시피 조회 API
export const getRecipeFavoriteApi = async (memberId: number, page: number): Promise<PaginationRecipeList> => {
  try {
    const response = await instance.get(`/v1/member/recipe/${memberId}/favorites?page=${page}&sort=createdAt,desc`);
    // console.log(`/v1/member/recipe/${memberId}/favorites?page=${page}`, response.data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(error as string);
  }
};
