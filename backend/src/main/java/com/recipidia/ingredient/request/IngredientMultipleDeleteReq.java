package com.recipidia.ingredient.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record IngredientMultipleDeleteReq(
    @NotBlank(message = "재료 이름은 필수입니다.")
    String name,

    @Min(value = 1, message = "출고할 수량은 최소 1개 이상이어야 합니다.")
    int quantity
) {}