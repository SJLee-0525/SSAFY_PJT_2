package com.recipidia.member.service;

import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.dto.RecipeWithMemberInfoDto;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberRecipeService {
  MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating, Boolean favorite);
  List<MemberRecipeDto> getMemberRecipes(Long memberId);
  Page<RecipeWithMemberInfoDto> getMemberFavorites(Long memberId, Pageable pageable);
  Page<RecipeWithMemberInfoDto> getMemberRatedRecipes(Long memberId, Pageable pageable);


}
