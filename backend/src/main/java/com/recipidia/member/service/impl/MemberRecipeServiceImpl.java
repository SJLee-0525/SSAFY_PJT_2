package com.recipidia.member.service.impl;


import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.dto.RecipeWithMemberInfoDto;
import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.member.exception.MemberNotFoundException;
import com.recipidia.member.exception.RecipeNotFoundException;
import com.recipidia.member.repository.MemberRecipeRepository;
import com.recipidia.member.repository.MemberRepository;
import com.recipidia.member.service.MemberRecipeService;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.repository.RecipeRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberRecipeServiceImpl implements MemberRecipeService {

  private final MemberRepository memberRepository;
  private final RecipeRepository recipeRepository;
  private final MemberRecipeRepository memberRecipeRepository;

  @Override
  @Transactional
  public MemberRecipeDto patchMemberRecipe(Long memberId, Long recipeId, Integer rating,
      Boolean favorite) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RecipeNotFoundException(recipeId));

    Optional<MemberRecipe> optMemberRecipe = memberRecipeRepository.findByMemberIdAndRecipeId(
        memberId, recipeId);
    MemberRecipe memberRecipe = optMemberRecipe.orElseGet(() -> {
      MemberRecipe newMemberRecipe = MemberRecipe.builder()
          .member(member)
          .recipe(recipe)
          .rating(rating != null ? rating : 0)
          .favorite(favorite != null && favorite) // 기본 값 false
          .createdAt(LocalDateTime.now())
          .build();
      memberRecipeRepository.save(newMemberRecipe); // 새 객체 저장
      return newMemberRecipe;
    });

    if (rating != null) {
      memberRecipe.updateRating(rating);
    }
    if (favorite != null) {
      memberRecipe.updateFavorite(favorite);
    }

    memberRecipe.updateCreatedAt(LocalDateTime.now());

    // patch 결과 rating이 null이고 favorite이 false이면 객체 삭제
    if (memberRecipe.getRating() == 0 && Boolean.FALSE.equals(memberRecipe.getFavorite())) {
      memberRecipeRepository.delete(memberRecipe);
    }

    return MemberRecipeDto.fromEntity(memberRecipe);
  }


  @Override
  @Transactional(readOnly = true)
  public List<MemberRecipeDto> getMemberRecipes(Long memberId) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new IllegalArgumentException("Member not found with id: " + memberId));

    return memberRecipeRepository.findAllByMember(member)
        .stream()
        .map(MemberRecipeDto::fromEntity)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public Page<RecipeWithMemberInfoDto> getMemberFavorites(Long memberId,
      Pageable pageable) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));

    Page<MemberRecipe> allByMemberAndFavoriteTrue = memberRecipeRepository.findAllByMemberAndFavoriteTrue(
        member, pageable);

    return allByMemberAndFavoriteTrue.map(
        mr -> RecipeWithMemberInfoDto.fromEntities(mr.getRecipe(), mr));
  }

  @Override
  @Transactional(readOnly = true)
  public Page<RecipeWithMemberInfoDto> getMemberRatedRecipes(Long memberId, Pageable pageable) {
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new MemberNotFoundException(memberId));

    Page<MemberRecipe> allByMemberAndRatingIsNotZero = memberRecipeRepository.findAllByMemberAndRatingNot(member, 0, pageable);

    return allByMemberAndRatingIsNotZero.map(
        mr -> RecipeWithMemberInfoDto.fromEntities(mr.getRecipe(), mr));
  }
}
