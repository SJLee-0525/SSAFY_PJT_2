package com.recipidia.ingredient.service;


import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientSimpleInfoDto;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientMultipleDeleteReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import java.util.List;
import java.util.Map;

public interface IngredientService {

  List<IngredientSimpleInfoDto> getAllIngredientInfo();

  List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam);

  IngredientInfoDto getIngredient(Long ingredientId);

  IngredientIncomingRes stockItem(IngredientIncomingReq request);

  IngredientUpdateRes updateItem(Long itemId, IngredientUpdateReq updateDTO);

  IngredientInfoWithNutrientDto getIngredientInfoWithNutrients(Long id);

  Map<String, Integer> releaseMultipleItems(List<IngredientMultipleDeleteReq> requests);

  List<IngredientInfoWithNutrientDto> getAllExistingIngredientsWithNutrients();
}
