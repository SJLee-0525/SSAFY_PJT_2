export interface filteringInformationKeys {
  categories: string[];
  dietaries: string[];
  allergies: string[];
}

export interface filteredInfomations {
  categories: string[];
  dietaries: string[];
  preferredIngredients: string[];
  dislikedIngredients: string[];
  allergies: string[];
}

export interface FilterElementProps {
  type: "categories" | "dietaries" | "allergies";
  content: string;
  keys: string[];
  elements: string[];
  onSetFilter: (type: "categories" | "dietaries" | "allergies", value: string) => void;
  onClear: (type: "categories" | "dietaries" | "allergies") => void;
}

export interface IngredientsPreferenceProps {
  type: "preferredIngredients" | "dislikedIngredients";
  label: string;
  placeHolder: string;
  selectedList: filteredInfomations;
  onSetFilter: (type: "preferredIngredients" | "dislikedIngredients", value: string) => void;
  onClear: (type: "preferredIngredients" | "dislikedIngredients") => void;
}
