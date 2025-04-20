package com.recipidia.recipe.dto;

import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.response.RecipeExtractRes;

// RecipeDetailDto.java
public record RecipeDetailDto(
    Long recipeId,
    String name,
    String title,
    String url,
    String channelTitle,
    String duration,
    long viewCount,
    long likeCount,
    Boolean hasCaption,
    RecipeExtractRes textRecipe
) {
  public static RecipeDetailDto fromEntities(Recipe recipe, RecipeExtractRes extractRes) {
    // RecipeWithMemberInfoDto와 유사하게 변환합니다.
    return new RecipeDetailDto(
        recipe.getId(),
        recipe.getName(),
        recipe.getTitle(),
        recipe.getYoutubeUrl(),
        recipe.getChannelTitle(),
        recipe.getDuration(),
        recipe.getViewCount(),
        recipe.getLikeCount(),
        recipe.getHasCaption(),
        extractRes
    );
  }
}

