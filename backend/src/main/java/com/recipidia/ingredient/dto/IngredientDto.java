package com.recipidia.ingredient.dto;

import com.recipidia.ingredient.entity.Ingredient;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link Ingredient}
 */
public record IngredientDto(Long ingredientId, String storagePlace, LocalDateTime expirationDate,
                            LocalDateTime incomingDate) implements
    Serializable {

  public static IngredientDto fromEntity(Ingredient ingredient) {
    return new IngredientDto(
        ingredient.getId(),
        ingredient.getStoragePlace(),
        ingredient.getExpirationDate(),
        ingredient.getIncomingDate()
    );
  }

  public static List<IngredientDto> fromEntity(List<Ingredient> ingredients) {
    return ingredients.stream().map(IngredientDto::fromEntity).toList();
  }
}