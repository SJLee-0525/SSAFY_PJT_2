package com.recipidia.ingredient.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Ingredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 냉장고 엔티티와 다대일 관계 설정 (FK: refrigerator_id)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ingredient_info_id", nullable = false)
  @JsonBackReference
  private IngredientInfo ingredientInfo;

  @Column
  private String storagePlace;

  @Column(nullable = false)
  private LocalDateTime expirationDate;

  @Column(nullable = false)
  private LocalDateTime incomingDate = LocalDateTime.now(); // 입고일자는 기본적으로 현재 시간 기준

  @Builder
  public Ingredient(
      IngredientInfo ingredientInfo,
      String storagePlace,
      LocalDateTime expirationDate,
      LocalDateTime incomingDate) {
    this.ingredientInfo = ingredientInfo;
    this.storagePlace = storagePlace;
    this.expirationDate = expirationDate;
    this.incomingDate = incomingDate;
  }

  public void modifyIngredientInfo(IngredientUpdateReq ingredientUpdateReq) {
    this.incomingDate = ingredientUpdateReq.getIncomingDate();
    this.storagePlace = ingredientUpdateReq.getStoragePlace();
    this.expirationDate = ingredientUpdateReq.getExpirationDate();
  }
}