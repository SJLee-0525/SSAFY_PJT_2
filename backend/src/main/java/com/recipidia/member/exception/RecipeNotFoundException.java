package com.recipidia.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class RecipeNotFoundException extends RuntimeException {
  public RecipeNotFoundException(Long recipeId) {
    super("Recipe not found with id: " + recipeId);
  }
}