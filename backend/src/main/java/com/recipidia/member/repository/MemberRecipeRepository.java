package com.recipidia.member.repository;

import com.recipidia.member.entity.Member;
import com.recipidia.member.entity.MemberRecipe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRecipeRepository extends JpaRepository<MemberRecipe, Long> {
  Optional<MemberRecipe> findByMemberIdAndRecipeId(Long memberId, Long recipeId);
  List<MemberRecipe> findAllByMember(Member member);
  Page<MemberRecipe> findAllByMemberAndFavoriteTrue(Member member, Pageable pageable);
  Page<MemberRecipe> findAllByMemberAndRatingNot(Member member, Integer rating, Pageable pageable);
  void deleteAllByMember(Member member);
}
