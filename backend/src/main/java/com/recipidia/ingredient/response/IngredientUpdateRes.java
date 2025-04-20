package com.recipidia.ingredient.response;

import com.recipidia.ingredient.entity.Ingredient;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class IngredientUpdateRes {
    private String storagePlace;
    private LocalDateTime expirationDate;
    private LocalDateTime incomingDate;

    public static IngredientUpdateRes fromEntity(Ingredient ingredient) {
        return new IngredientUpdateRes(ingredient.getStoragePlace(), ingredient.getExpirationDate(), ingredient.getIncomingDate());
    }
}
