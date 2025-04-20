package com.recipidia.ingredient.request;

import jakarta.validation.constraints.Positive;

public record IngredientDeleteReq(@Positive(message = "삭제 수량은 양수만 가능합니다") int quantity) {

}
