package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.RecipeIngredient;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link RecipeIngredient}
 */
public record RecipeIngredientDto(Long recipeIngredientId, String name, String quantity) implements
    Serializable {

    public static RecipeIngredientDto fromEntity(RecipeIngredient recipeIngredient) {
        return new RecipeIngredientDto(
            recipeIngredient.getId(),
            recipeIngredient.getName(),
            recipeIngredient.getQuantity()
        );
    }

    public static List<RecipeIngredientDto> fromEntity(List<RecipeIngredient> ingredients) {
        return ingredients.stream().map(RecipeIngredientDto::fromEntity).toList();
    }
}