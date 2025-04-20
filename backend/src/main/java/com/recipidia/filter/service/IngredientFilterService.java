package com.recipidia.filter.service;

import java.util.List;
import java.util.Set;

public interface IngredientFilterService {
  FilteredIngredientResult filterIngredientsByDietaries(List<String> dietaries, List<String> mainIngredients, List<String> allergies);

  record FilteredIngredientResult(
      List<String> ingredients,
      Set<String> preferredIngredients
  ) {}
}
