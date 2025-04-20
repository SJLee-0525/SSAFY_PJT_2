package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link IngredientInfo}
 */
@Getter
@NoArgsConstructor
public class IngredientSimpleInfoDto implements Serializable {

  private Long ingredientInfoId;
  private String name;
  private String imageUrl;
  private int totalCount;

  public IngredientSimpleInfoDto(Long ingredientInfoId, String name, String imageUrl, int totalCount) {
    this.ingredientInfoId = ingredientInfoId;
    this.name = name;
    this.imageUrl = imageUrl;
    this.totalCount = totalCount;
  }

  public static IngredientSimpleInfoDto fromEntity(IngredientInfo ingredientInfo) {
    int count = ingredientInfo.getIngredients().size();
    return new IngredientSimpleInfoDto(
        ingredientInfo.getId(),
        ingredientInfo.getName(),
        ingredientInfo.getImageUrl(),
        count
    );
  }
}