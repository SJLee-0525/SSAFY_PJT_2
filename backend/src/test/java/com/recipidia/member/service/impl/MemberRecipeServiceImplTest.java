package com.recipidia.member.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.recipidia.member.dto.RecipeWithMemberInfoDto;
import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.member.exception.MemberNotFoundException;
import com.recipidia.member.repository.MemberRecipeRepository;
import com.recipidia.member.repository.MemberRepository;
import com.recipidia.recipe.entity.Recipe;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

@DataJpaTest
class MemberRecipeServiceImplTest {

  @Mock
  private MemberRepository memberRepository;

  @Mock
  private MemberRecipeRepository memberRecipeRepository;

  @InjectMocks
  private MemberRecipeServiceImpl memberRecipeService;

  @Test
  void getMemberFavorites_ReturnsPagedDtoList_WhenMoreThanPageSize() {
    // given
    Long memberId = 1L;
    Member member = new Member("testuser");
    ReflectionTestUtils.setField(member, "id", memberId);

    // 10개의 MemberRecipe 만들기
    List<MemberRecipe> allRecipes = IntStream.range(0, 10)
        .mapToObj(i -> {
          Recipe recipe = new Recipe("recipe" + i, "url", "title", "channel", "duration", 100L, 10L, false);
          ReflectionTestUtils.setField(recipe, "id", (long) i);
          return new MemberRecipe(member, recipe, i, true, LocalDateTime.now());
        })
        .toList();

    // 페이징된 결과는 앞에서 5개만 추출
    Pageable pageable = PageRequest.of(0, 5);
    Page<MemberRecipe> page = new PageImpl<>(
        allRecipes.subList(0, 5), // 현재 페이지의 데이터
        pageable,
        allRecipes.size()         // 전체 개수 (10개)
    );

    when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
    when(memberRecipeRepository.findAllByMemberAndFavoriteTrue(member, pageable)).thenReturn(page);

    // when
    Page<RecipeWithMemberInfoDto> result = memberRecipeService.getMemberFavorites(memberId,
        pageable);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(10);
    assertThat(result.getContent()).hasSize(5);
    assertThat(result.getTotalPages()).isEqualTo(2);
    assertThat(result.hasNext()).isTrue();
  }


  @Test
  void getMemberFavorites_ThrowsException_WhenMemberNotFound() {
    // given
    Long memberId = 999L;
    when(memberRepository.findById(memberId)).thenReturn(Optional.empty());

    // when & then
    assertThatThrownBy(() -> memberRecipeService.getMemberFavorites(memberId, PageRequest.of(0, 5)))
        .isInstanceOf(MemberNotFoundException.class)
        .hasMessageContaining("Member not found with id: " + memberId);
  }

  @Test
  void getMemberRatedRecipes_ReturnsPagedDtoList_WhenMoreThanPageSize() {
    // given
    Long memberId = 1L;
    Member member = new Member("testuser");
    ReflectionTestUtils.setField(member, "id", memberId);

    List<MemberRecipe> allRecipes = IntStream.range(0, 10)
        .mapToObj(i -> {
          Recipe recipe = new Recipe("recipe" + i, "url", "title", "channel", "duration", 100L, 10L, false);
          ReflectionTestUtils.setField(recipe, "id", (long) i);
          return new MemberRecipe(member, recipe, i, true, LocalDateTime.now()); // rating = i
        })
        .toList();

    Pageable pageable = PageRequest.of(0, 5);
    Page<MemberRecipe> page = new PageImpl<>(
        allRecipes.subList(0, 5), // 페이징된 결과
        pageable,
        allRecipes.size()
    );

    when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));
    when(memberRecipeRepository.findAllByMemberAndRatingNot(member, 0, pageable)).thenReturn(page);

    // when
    Page<RecipeWithMemberInfoDto> result = memberRecipeService.getMemberRatedRecipes(memberId, pageable);

    // then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(10);
    assertThat(result.getContent()).hasSize(5);
    assertThat(result.getTotalPages()).isEqualTo(2);
    assertThat(result.hasNext()).isTrue();
  }

  @Test
  void getMemberRatedRecipes_ThrowsException_WhenMemberNotFound() {
    // given
    Long memberId = 999L;
    Pageable pageable = PageRequest.of(0, 5);
    when(memberRepository.findById(memberId)).thenReturn(Optional.empty());

    // when & then
    assertThatThrownBy(() -> memberRecipeService.getMemberRatedRecipes(memberId, pageable))
        .isInstanceOf(MemberNotFoundException.class)
        .hasMessageContaining("Member not found with id: " + memberId);
  }

}