package com.recipidia.member.dto;

import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.entity.Recipe;

public record RecipeWithMemberInfoDto(
    Long recipeId,
    String name,
    String title,
    String url,
    String channelTitle,
    String duration,
    long viewCount,
    long likeCount,
    Boolean hasCaption,
    Boolean favorite,
    Integer rating
) {

  public static RecipeWithMemberInfoDto fromEntities(Recipe recipe, MemberRecipe memberRecipe) {
    RecipeDto base = RecipeDto.fromEntity(recipe);
    return new RecipeWithMemberInfoDto(
        base.recipeId(),
        base.name(),
        base.title(),
        base.youtubeUrl(),
        base.channelTitle(),
        base.duration(),
        base.viewCount(),
        base.likeCount(),
        base.hasCaption(),
        memberRecipe.getFavorite(),
        memberRecipe.getRating()
    );
  }
}
