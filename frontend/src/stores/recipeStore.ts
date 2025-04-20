import { create } from "zustand";
import { RecipeInfo, RecipeList } from "@/types/recipeListTypes";
import { SelectedIngredients } from "@/types/ingredientsTypes";

import { devtools } from "zustand/middleware";

interface RecipeStore {
  recipeList: RecipeList;
  detailRecipe: RecipeInfo;
  recipeSelectedIngredients: SelectedIngredients[];
  hasFetchedDetailRecipe: boolean;
  setRecipeList: (recipeList: RecipeList) => void;
  setDetailRecipe: (detailRecipe: RecipeInfo) => void;
  setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) => void;
  resetRecipeList: () => void;
  resetDetailRecipe: () => void;
  resetRecipeSelectedIngredients: () => void;
  setHasFetchedDetailRecipe: (fetched: boolean) => void;
  updateRecipeFavorite: (recipeId: number, favorite: boolean) => void;
}

const useRecipeStore = create<RecipeStore>()(
  devtools((set) => ({
    recipeList: { dishes: [], videos: {} },
    detailRecipe: {
      recipeId: 0,
      name: "",
      title: "",
      url: "",
      channelTitle: "",
      duration: "",
      viewCount: 0,
      likeCount: 0,
      hasCaption: false,
      textRecipe: null,
    },
    recipeSelectedIngredients: [],
    hasFetchedDetailRecipe: false,

    setRecipeList: (recipeList: RecipeList) => set({ recipeList }),
    setDetailRecipe: (detailRecipe: RecipeInfo) => set({ detailRecipe }),
    setRecipeSelectedIngredients: (recipeSelectedIngredients: SelectedIngredients[]) =>
      set({ recipeSelectedIngredients }),
    resetRecipeList: () => set({ recipeList: { dishes: [], videos: {} } }),
    resetDetailRecipe: () =>
      set({
        detailRecipe: {
          recipeId: 0,
          name: "",
          title: "",
          url: "",
          channelTitle: "",
          duration: "",
          viewCount: 0,
          likeCount: 0,
          hasCaption: false,
          textRecipe: null,
        },
      }),
    resetRecipeSelectedIngredients: () => set({ recipeSelectedIngredients: [] }),
    //레시피 상세 조회 API 응답 여부 확인
    setHasFetchedDetailRecipe: (fetched: boolean) => set({ hasFetchedDetailRecipe: fetched }),
    //즐겨찾기 누른 레시피 업데이트
    updateRecipeFavorite: (recipeId: number, favorite: boolean) =>
      set((state) => {
        const updatedRecipeList = { ...state.recipeList };

        // videos 객체 내의 모든 배열을 순회하며 해당 recipeId를 가진 비디오 업데이트
        Object.keys(updatedRecipeList.videos).forEach((key) => {
          updatedRecipeList.videos[key] = updatedRecipeList.videos[key].map((video) =>
            video.recipeId === recipeId ? { ...video, favorite } : video
          );
        });

        return { recipeList: updatedRecipeList };
      }),
  }))
);

export default useRecipeStore;
