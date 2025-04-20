package com.recipidia.filter.service.impl;

import com.recipidia.filter.dto.NutritionCriteria;
import com.recipidia.filter.service.IngredientFilterService;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientNutrientDto;
import com.recipidia.ingredient.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class IngredientFilterServiceImpl implements IngredientFilterService {

  private static final Logger log = LoggerFactory.getLogger(IngredientFilterServiceImpl.class);
  private final IngredientService ingredientService;

  @Override
  public FilteredIngredientResult filterIngredientsByDietaries(List<String> dietaries, List<String> mainIngredients, List<String> allergies) {
    Set<String> preferredIngredients = new HashSet<>();
    Set<String> mainIngredientsSet = new HashSet<>(mainIngredients); // 빠른 조회를 위해 Set으로 전환

    List<String> filteredIngredients = ingredientService.getAllExistingIngredientsWithNutrients().stream()
        .filter(ingredient -> isIngredientSuitable(ingredient, dietaries, preferredIngredients, mainIngredientsSet, allergies))
        .map(IngredientInfoWithNutrientDto::name)
        .collect(Collectors.toList());

    // 💡 main_ingredients에 있지만 필터링된 리스트에 빠진 경우 강제로 추가
    for (String main : mainIngredients) {
      if (!filteredIngredients.contains(main)) {
        log.warn("⚠️ 주재료 '{}' 누락되어 재료 리스트에 추가 (주재료 포함 보장)", main);
        filteredIngredients.add(main);
      }
    }

    return new FilteredIngredientResult(filteredIngredients, preferredIngredients);
  }

  private boolean isIngredientSuitable(
      IngredientInfoWithNutrientDto ingredient,
      List<String> dietaries,
      Set<String> preferredIngredients,
      Set<String> mainIngredients,
      List<String> allergies
  ) {
    String name = ingredient.name();

    // 메인 재료는 무조건 유지
    if (mainIngredients.contains(name)) {
      log.info("✅ '{}' 유지 (메인 재료)", name);
      return true;
    }

    // DB에 nutrient 정보가 없는 경우 예외 처리(비동기 업데이트 완료 전 요청 시)
    IngredientNutrientDto nutrients = ingredient.nutrients();
    if (nutrients == null) {
      log.warn("⚠️ '{}' 통과: nutrients 데이터가 없습니다 (null)", name);
      return true;
    }

    // 알레르기 필터링
    if (isAllergic(nutrients.allergenInfo(), allergies, name)) {
      return false;
    }

    double calories = nutrients.calories();
    if (calories <= 0) {
      log.warn("🚨 '{}' 통과: 칼로리 정보 없음 또는 0 이하 (calories={})", name, calories);
      return true;
    }

    // 영양소 비율 체크
    if (isRatioExceeded("저당식", dietaries, name,
        new NutritionCriteria(nutrients.sugars(), 4, calories, 50.0, "당"))) {
      return false;
    }
    if (isRatioExceeded("저지방식", dietaries, name,
        new NutritionCriteria(nutrients.fat(), 9, calories, 50.0, "지방"))) {
      return false;
    }
    if (isRatioExceeded("저탄수화물식", dietaries, name,
        new NutritionCriteria(nutrients.carbohydrate(), 4, calories, 45.0, "탄수화물"))) {
      return false;
    }

    // 고단백식일 경우 선호 재료로 추가
    if (dietaries.contains("고단백식")) {
      double proteinRatio = calcRatio(nutrients.protein(), 4, calories);
      if (proteinRatio >= 35.0) {
        log.info("💡 '{}' 선호 재료 추가 (고단백식): 단백질 비율 {}% 이상", name, proteinRatio);
        preferredIngredients.add(name);
      }
    }

    return true;
  }

  // 알레르기 정보를 검사하는 헬퍼 메소드
  private boolean isAllergic(String allergenInfo, List<String> allergies, String ingredientName) {
    if (allergenInfo != null && !allergenInfo.isBlank()) {
      for (String allergen : allergies) {
        if (allergenInfo.contains(allergen)) {
          log.info("❌ '{}' 제외 (알레르기 필터 '{}')", ingredientName, allergen);
          return true;
        }
      }
    }
    return false;
  }

  // 영양소 비율 계산 메소드
  private double calcRatio(double nutrientValue, double multiplier, double calories) {
    return (nutrientValue * multiplier / calories) * 100;
  }

  // 영양소 비율 초과 여부를 판단하는 메소드
  private boolean isRatioExceeded(String dietary, List<String> dietaries, String ingredientName, NutritionCriteria criteria) {
    if (!dietaries.contains(dietary)) {
      return false;
    }
    double ratio = calcRatio(criteria.nutrientValue(), criteria.multiplier(), criteria.calories());
    if (ratio > criteria.threshold()) {
      log.info("❌ '{}' 제외 ({} 필터): {} 비율 {}% 초과", ingredientName, criteria.nutrientLabel(), criteria.nutrientLabel(), ratio);
      return true;
    }
    return false;
  }
}