package com.recipidia.ingredient.repository.querydsl;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.entity.QIngredient;
import com.recipidia.ingredient.entity.QIngredientInfo;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Repository;

@Repository
public class IngredientQueryRepositoryImpl implements IngredientQueryRepository {

  private final JPAQueryFactory queryFactory;
  private final IngredientQueryConditionBuilder conditionBuilder;

  public IngredientQueryRepositoryImpl(JPAQueryFactory queryFactory) {
    this.queryFactory = queryFactory;
    this.conditionBuilder = new IngredientQueryConditionBuilder();
  }

  @Override
  public List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam) {
    QIngredient ingredient = QIngredient.ingredient;
    QIngredientInfo ingredientInfo = QIngredientInfo.ingredientInfo;

    BooleanBuilder whereClause = conditionBuilder.buildStorageCondition(filterParam);
    OrderSpecifier<?> order = conditionBuilder.buildSortOrder(filterParam);

    List<IngredientInfo> ingredientInfoList = queryFactory.selectFrom(ingredientInfo)
        .innerJoin(ingredientInfo.ingredients, ingredient)
        .fetchJoin()
        .where(whereClause)
        .orderBy(order)
        .fetch();

    return ingredientInfoList.stream()
        .map(IngredientInfoDto::fromEntity)
        .toList();
  }
}
