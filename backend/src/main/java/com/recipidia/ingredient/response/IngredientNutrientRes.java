package com.recipidia.ingredient.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientNutrientRes {
    private float calories;
    private float carbohydrate;
    private float protein;
    private float fat;
    private float sodium;
    private float sugars;
    private float cholesterol;
    private float saturatedFat;
    private float unsaturatedFat;
    private float transFat;
    private String allergenInfo;
}