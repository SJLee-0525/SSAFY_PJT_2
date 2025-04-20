export interface Ingredients {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  totalCount: number;
  earliestExpiration: string;
  latestExpiration: string;
}

export interface IngredientsSearchInfo {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Ingredient {
  ingredientId: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
  releasingDate: string | null;
}

export interface Nutritions {
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sodium: number;
  sugars: number;
  cholesterol: number;
  saturatedFat: number;
  unsaturatedFat: number;
  transFat: number;
  allergenInfo: string;
}

export interface IngredientNutrition {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  totalCount: number;
  ingredients: Ingredient[];
  nutrients: Nutritions | null;
}

export interface StoreIngredient {
  name: string;
  amount: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
}

export interface StoreResponseIngredient {
  name: string;
  amount: number;
  storagePlace: string;
  expirationDate: string;
  incomingDate: string;
}

export interface SelectedIngredients {
  ingredientInfoId: number;
  name: string;
  imageUrl: string;
  selectedCount: number;
}

export interface DeleteIngredient {
  name: string;
  quantity: number;
}

export interface DeleteIngredientResponse {
  [key: string]: number;
}
