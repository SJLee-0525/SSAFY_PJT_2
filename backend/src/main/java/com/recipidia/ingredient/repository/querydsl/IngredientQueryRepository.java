package com.recipidia.ingredient.repository.querydsl;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import java.util.List;
import java.util.Map;

public interface IngredientQueryRepository {

  List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam);
}
