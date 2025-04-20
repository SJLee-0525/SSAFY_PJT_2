package com.recipidia.ingredient.repository.querydsl;

import static org.assertj.core.api.Assertions.assertThat;

import com.recipidia.config.QueryDslConfig;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({IngredientQueryRepositoryImpl.class, QueryDslConfig.class})
class IngredientQueryRepositoryImplTest {

  @Autowired
  private EntityManager em;

  @Autowired
  private IngredientQueryRepositoryImpl ingredientQueryRepository;

  private IngredientInfo info;

  private void createIngredients(String storagePlace, IngredientInfo info, int count) {
    for (int i = 0; i < count; i++) {
      Ingredient ingredient = Ingredient.builder()
          .ingredientInfo(info)
          .storagePlace(storagePlace)
          .expirationDate(LocalDateTime.now().plusDays(7-i))
          .incomingDate(LocalDateTime.now())
          .build();
      em.persist(ingredient);
      info.getIngredients().add(ingredient);
    }
  }

  @BeforeEach
  void setUpData() {
    info = new IngredientInfo("대파", "");
    em.persist(info);
    createIngredients("fridge", info, 2);
    createIngredients("freezer", info, 3);
    em.flush();
    em.clear();
  }

  private void storageTest(String storage, int resultCnt) {
    Map<String, String> params = Map.of("storage", storage);
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);
    assertThat(result.get(0).getTotalCount()).isEqualTo(resultCnt);
  }

  @Test
  void findAllExistingIngredientsForFridge() {
    storageTest("fridge", 2);
  }

  @Test
  void findAllExistingIngredientsForFreezer() {
    storageTest("freezer", 3);
  }

  @Test
  void findAllExistingIngredientsForAll() {
    storageTest("all", 5);
  }
}
