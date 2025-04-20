package com.recipidia.member.entity;

import com.recipidia.recipe.entity.Recipe;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class MemberRecipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 사용자와의 연관관계 (ManyToOne)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false)
  private Member member;

  // 레시피와의 연관관계 (ManyToOne)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "recipe_id", nullable = false)
  private Recipe recipe;

  // 별점
  @Column
  private Integer rating = 0;

  // 즐겨찾기 여부
  @Column
  private Boolean favorite = false;

  // 사용 날짜
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Builder
  public MemberRecipe(Member member, Recipe recipe, Integer rating, Boolean favorite, LocalDateTime createdAt) {
    this.member = member;
    this.recipe = recipe;
    this.rating = rating;
    this.favorite = favorite;
    this.createdAt = createdAt;
  }

  public void updateRating(Integer rating) {
    this.rating = rating;
  }

  public void updateFavorite(Boolean favorite) {
    this.favorite = favorite;
  }

  public void updateCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
