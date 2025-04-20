package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.Recipe;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link Recipe}
 */
public record RecipeDto(Long recipeId, String name, String title, String youtubeUrl,
                        boolean hasTextRecipe, List<RecipeIngredientDto> ingredients,
                        String channelTitle, String duration, long viewCount,
                        long likeCount, Boolean hasCaption) implements
        Serializable {

    public static RecipeDto fromEntity(Recipe recipe) {
        List<RecipeIngredientDto> ingredientDtos = recipe.getIngredients().stream()
                .map(RecipeIngredientDto::fromEntity)
                .toList();
        return new RecipeDto(
            recipe.getId(),
            recipe.getName(),
            recipe.getTitle(),
            recipe.getYoutubeUrl(),
            recipe.getTextRecipe() != null,
            ingredientDtos,
            recipe.getChannelTitle(),
            recipe.getDuration(),
            recipe.getViewCount(),
            recipe.getLikeCount(),
            recipe.getHasCaption()
        );
    }

}