package com.recipidia.ingredient.handler;

import com.recipidia.exception.GlobalExceptionResponse;
import com.recipidia.ingredient.exception.IngredientException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class IngredientExceptionHandler {

  // handle IngredientException
  @ExceptionHandler(IngredientException.class)
  public ResponseEntity<GlobalExceptionResponse> handleIngredientException(IngredientException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(GlobalExceptionResponse.builder()
            .httpstatus(HttpStatus.BAD_REQUEST.value())
            .errorMsg(e.getMessage())
            .build());
  }
}
