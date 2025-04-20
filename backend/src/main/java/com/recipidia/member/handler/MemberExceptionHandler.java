package com.recipidia.member.handler;

import com.recipidia.member.exception.RecipeNotFoundException;
import com.recipidia.member.exception.MemberNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class MemberExceptionHandler {

  @ExceptionHandler(MemberNotFoundException.class)
  public ResponseEntity<String> handleMemberNotFound(MemberNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }

  @ExceptionHandler(RecipeNotFoundException.class)
  public ResponseEntity<String> handleRecipeNotFound(RecipeNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
  }
}
