package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientNutrient;

import java.io.Serializable;

/**
 * DTO for {@link IngredientNutrient}
 */
public record IngredientNutrientDto(
        float calories,
        float carbohydrate,
        float protein,
        float fat,
        float sodium,
        float sugars,
        float cholesterol,
        float saturatedFat,
        float unsaturatedFat,
        float transFat,
        String allergenInfo
) implements Serializable {

    public static IngredientNutrientDto fromEntity(IngredientNutrient nutrient) {
        if (nutrient == null) return null;

        return new IngredientNutrientDto(
                nutrient.getCalories(),
                nutrient.getCarbohydrate(),
                nutrient.getProtein(),
                nutrient.getFat(),
                nutrient.getSodium(),
                nutrient.getSugars(),
                nutrient.getCholesterol(),
                nutrient.getSaturatedFat(),
                nutrient.getUnsaturatedFat(),
                nutrient.getTransFat(),
                nutrient.getAllergenInfo()
        );
    }
}
