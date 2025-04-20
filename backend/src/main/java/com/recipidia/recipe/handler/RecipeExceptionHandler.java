package com.recipidia.recipe.handler;

import com.recipidia.exception.GlobalExceptionResponse;
import com.recipidia.recipe.exception.NoRecipeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RecipeExceptionHandler {

  // handle NoRecipeException
  @ExceptionHandler(NoRecipeException.class)
  public ResponseEntity<GlobalExceptionResponse> handleRecipeException(NoRecipeException e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(GlobalExceptionResponse.builder()
            .httpstatus(HttpStatus.NOT_FOUND.value())
            .errorMsg(e.getMessage())
            .build());
  }
}
