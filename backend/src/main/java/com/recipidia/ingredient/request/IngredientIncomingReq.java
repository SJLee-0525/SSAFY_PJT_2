package com.recipidia.ingredient.request;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class IngredientIncomingReq {
    private String name;
    private Integer amount;
    private String storagePlace;
    private LocalDateTime expirationDate;
    private LocalDateTime incomingDate;
}

