package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO for {@link com.recipidia.ingredient.entity.IngredientInfo}
 */
@Getter
@NoArgsConstructor
public class IngredientInfoDto implements Serializable {

  @NotNull
  private Long ingredientInfoId;
  @NotNull
  private String name;
  private String imageUrl;
  private int totalCount;
  private LocalDateTime earliestExpiration;
  private LocalDateTime latestExpiration;

  public IngredientInfoDto(Long id, String name, String imageUrl) {
    this.ingredientInfoId = id;
    this.name = name;
    this.imageUrl = imageUrl;
  }

  public static IngredientInfoDto fromEntity(IngredientInfo ingredientInfo) {
    ingredientInfo.setEarliestExpiration();
    IngredientInfoDto ingredientInfoDto = new IngredientInfoDto(
        ingredientInfo.getId(),
        ingredientInfo.getName(),
        ingredientInfo.getImageUrl()
    );
    ingredientInfoDto.totalCount = ingredientInfo.getIngredients().size();
    ingredientInfoDto.earliestExpiration = ingredientInfo.getEarliestExpiration();
    ingredientInfoDto.latestExpiration = ingredientInfo.getLatestExpiration();
    return ingredientInfoDto;
  }
}