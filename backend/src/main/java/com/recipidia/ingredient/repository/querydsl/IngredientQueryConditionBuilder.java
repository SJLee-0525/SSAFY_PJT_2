package com.recipidia.ingredient.repository.querydsl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.Expressions;
import com.recipidia.ingredient.entity.QIngredient;
import com.recipidia.ingredient.entity.QIngredientInfo;
import com.recipidia.ingredient.enums.SortKey;
import com.recipidia.ingredient.enums.StorageType;
import java.util.Map;

public class IngredientQueryConditionBuilder {

  public static final QIngredient ingredient = QIngredient.ingredient;
  public static final QIngredientInfo ingredientInfo = QIngredientInfo.ingredientInfo;

  public BooleanBuilder buildStorageCondition(Map<String, String> filterParam) {
    BooleanBuilder builder = new BooleanBuilder(Expressions.TRUE);

    // 저장 위치
    if (filterParam.containsKey("storage")) {
      try {
        StorageType storage = StorageType.from(filterParam.get("storage"));
        if (storage == StorageType.ALL) {
          return builder; // ALL 이면 바로 종료
        }
        builder.and(ingredient.storagePlace.eq(storage.getValue()));
      } catch (IllegalArgumentException ignored) {
        // 잘못된 storagePlace는 무시
      }
    }

    return builder;
  }

  public OrderSpecifier<?> buildSortOrder(Map<String, String> filterParam) {
    String sortKey = filterParam.getOrDefault("sort", "name");
    String orderStr = filterParam.getOrDefault("order", "asc");
    boolean isAsc = orderStr.equalsIgnoreCase("asc");

    try {
      SortKey sort = SortKey.from(sortKey);
      return switch (sort) {
        case EXPIRE -> isAsc ?
            ingredientInfo.earliestExpiration.asc() : ingredientInfo.latestExpiration.desc();
        case NAME -> isAsc ?
            ingredientInfo.name.asc() : ingredientInfo.name.desc();
      };
    } catch (IllegalArgumentException e) {
      return ingredientInfo.name.asc(); // fallback
    }
  }
}
