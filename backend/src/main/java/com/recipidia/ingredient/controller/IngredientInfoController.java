package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.service.IngredientInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingredient/info/admin")
@RequiredArgsConstructor
public class IngredientInfoController {

  private final IngredientInfoService ingredientInfoService;

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteIngredientInfo(@PathVariable Long id) {
    ingredientInfoService.deleteIngredientInfo(id);
    return ResponseEntity.noContent().build();
  }
}
