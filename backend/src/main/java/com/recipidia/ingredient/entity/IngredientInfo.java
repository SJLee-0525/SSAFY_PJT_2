package com.recipidia.ingredient.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
//@Setter // Entity는 setter를 사용하지 않는 것이 좋음
public class IngredientInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Column
  private String imageUrl;

  @Column
  private LocalDateTime earliestExpiration;

  @Column
  private LocalDateTime latestExpiration;

  // 하나의 냉장고가 여러 재료 항목을 가질 수 있음
  // @OneToMany는 fetchType이 기본적으로 lazy임
  @OneToMany(mappedBy = "ingredientInfo", cascade = CascadeType.PERSIST)
  @JsonManagedReference // 어떤 역할을 하는 어노테이션일까요?
  private final List<Ingredient> ingredients = new ArrayList<>(); // 빈 리스트로 초기화해주는게 좋음 null 참조때문에

  @OneToOne(mappedBy = "ingredientInfo", cascade = CascadeType.ALL)
  private IngredientNutrient ingredientNutrients;

  public IngredientInfo(String name, String imageUrl) {
    this.name = name;
    this.imageUrl = imageUrl;
  }

  public void attachIngredientNutrients(IngredientNutrient ingredientNutrients) {
    this.ingredientNutrients = ingredientNutrients;
    ingredientNutrients.linkIngredientInfo(this);  // 양방향 관계 설정
  }

  public void setEarliestExpiration() {
    List<LocalDateTime> expirationList = ingredients.stream()
        .map(Ingredient::getExpirationDate)
        .sorted()
        .toList();

    if (!expirationList.isEmpty()) {
      this.earliestExpiration = expirationList.get(0);
      this.latestExpiration = expirationList.get(expirationList.size() - 1);
    } else {
      this.earliestExpiration = null;
      this.latestExpiration = null;
    }
  }
}
