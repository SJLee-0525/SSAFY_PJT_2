package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientInfo;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link IngredientInfo}
 */
public record IngredientInfoWithNutrientDto(
        Long ingredientInfoId,
        String name,
        String imageUrl,
        int totalCount,
        List<IngredientDto> ingredients,
        IngredientNutrientDto nutrients
) implements Serializable {

    public static IngredientInfoWithNutrientDto fromEntity(IngredientInfo ingredientInfo) {
        return new IngredientInfoWithNutrientDto(
                ingredientInfo.getId(),
                ingredientInfo.getName(),
                ingredientInfo.getImageUrl(),
                ingredientInfo.getIngredients().size(),
                ingredientInfo.getIngredients().stream()
                        .map(IngredientDto::fromEntity)
                        .toList(),
                IngredientNutrientDto.fromEntity(ingredientInfo.getIngredientNutrients())
        );
    }
}
