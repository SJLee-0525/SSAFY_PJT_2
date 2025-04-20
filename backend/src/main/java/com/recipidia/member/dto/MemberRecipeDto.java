package com.recipidia.member.dto;

import com.recipidia.member.entity.MemberRecipe;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link MemberRecipe}
 */
public record MemberRecipeDto(Long memberId, Long recipeId,
                              Integer rating, Boolean favorite, LocalDateTime createdAt)
    implements Serializable {

  public static MemberRecipeDto fromEntity(MemberRecipe memberRecipe) {
    return new MemberRecipeDto(
        memberRecipe.getMember().getId(),
        memberRecipe.getRecipe().getId(),
        memberRecipe.getRating(),
        memberRecipe.getFavorite(),
        memberRecipe.getCreatedAt()
    );
  }
}
