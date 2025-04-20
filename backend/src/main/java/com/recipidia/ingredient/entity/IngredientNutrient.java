package com.recipidia.ingredient.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class IngredientNutrient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ingredient_info_id", nullable = false, unique = true)
    private IngredientInfo ingredientInfo;

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

    @Builder
    public IngredientNutrient(IngredientInfo ingredientInfo, float calories, float carbohydrate,
                              float protein, float fat, float sodium, float sugars,
                              float cholesterol, float saturatedFat, float unsaturatedFat,
                              float transFat, String allergenInfo) {
        this.ingredientInfo = ingredientInfo;
        this.calories = calories;
        this.carbohydrate = carbohydrate;
        this.protein = protein;
        this.fat = fat;
        this.sodium = sodium;
        this.sugars = sugars;
        this.cholesterol = cholesterol;
        this.saturatedFat = saturatedFat;
        this.unsaturatedFat = unsaturatedFat;
        this.transFat = transFat;
        this.allergenInfo = allergenInfo;
    }

    public void linkIngredientInfo(IngredientInfo ingredientInfo) {
        this.ingredientInfo = ingredientInfo;
    }
}

