package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientNutrientRepository;
import com.recipidia.ingredient.repository.IngredientRepository;
import com.recipidia.ingredient.service.IngredientDocumentService;
import com.recipidia.ingredient.service.IngredientInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IngredientInfoServiceImpl implements IngredientInfoService {

  private final IngredientInfoRepository ingredientInfoRepository;
  private final IngredientRepository ingredientRepository;
  private final IngredientNutrientRepository ingredientNutrientRepository; // 필요하다면
  private final IngredientDocumentService ingredientDocumentService;

  @Override
  @Transactional
  public void deleteIngredientInfo(Long id) {
    // 1. 삭제할 엔티티 조회
    IngredientInfo info = ingredientInfoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("해당 재료정보가 존재하지 않습니다."));

    // 2. 연관 Ingredient 삭제
    ingredientRepository.deleteAll(info.getIngredients());

    // 3. 연관 IngredientNutrient 삭제
    if (info.getIngredientNutrients() != null) {
      ingredientNutrientRepository.delete(info.getIngredientNutrients());
    }

    // 4. IngredientInfo 삭제
    ingredientInfoRepository.delete(info);

    // 5. ElasticSearch 인덱스에서도 삭제
    ingredientDocumentService.deleteIngredientDocumentById(id);
  }
}
