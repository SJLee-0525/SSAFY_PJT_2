package com.recipidia.ingredient.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientIncomingRes {
    private String name;
    private Integer amount;
    private String storagePlace;
    private LocalDateTime expirationDate;
    private LocalDateTime incomingDate;


}

