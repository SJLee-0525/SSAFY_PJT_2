package com.recipidia.ingredient.repository.querydsl;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

import com.recipidia.config.QueryDslConfig;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({IngredientQueryRepositoryImpl.class, QueryDslConfig.class})
class IngredientSortTest {

  @Autowired
  private EntityManager em;

  @Autowired
  private IngredientQueryRepositoryImpl ingredientQueryRepository;

  private void createIngredientsWithDifferentExpirationTimes(IngredientInfo info) {
    em.persist(info); // Persist IngredientInfo first
    for (int i = 0; i < 5; i++) {
      Ingredient ingredient = Ingredient.builder()
          .ingredientInfo(info)
          .storagePlace("freezer")
          .expirationDate(LocalDateTime.now().plusDays(i))
          .incomingDate(LocalDateTime.now())
          .build();
      em.persist(ingredient);
      info.getIngredients().add(ingredient);
    }
    info.setEarliestExpiration();
  }

  @BeforeEach
  void setUpData() {
    List<String> ingredientNameList = List.of("대파", "양파", "마늘", "고추", "파프리카");
    for (String ingredientName : ingredientNameList) {
      IngredientInfo ingredientInfo = new IngredientInfo(ingredientName, "");
      em.persist(ingredientInfo);
      createIngredientsWithDifferentExpirationTimes(ingredientInfo);
    }
  }

  @Test
  void findAllExistingIngredientsSortedByExpireAsc() {
    Map<String, String> params = Map.of("sort", "expire", "order", "asc");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);
    assertThat(result).isSortedAccordingTo(
        Comparator.comparing(IngredientInfoDto::getEarliestExpiration));
  }

  @Test
  void findAllExistingIngredientsSortedByExpireDesc() {
    Map<String, String> params = Map.of("sort", "expire", "order", "desc");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);
    assertThat(result).isSortedAccordingTo(
        Comparator.comparing(IngredientInfoDto::getLatestExpiration).reversed());
  }

  @Test
  void findAllExistingIngredientsSortedByNameAsc() {
    Map<String, String> params = Map.of("sort", "name", "order", "asc");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);
    assertThat(result).isSortedAccordingTo(Comparator.comparing(IngredientInfoDto::getName));
  }

  @Test
  void findAllExistingIngredientsSortedByNameDesc() {
    Map<String, String> params = Map.of("sort", "name", "order", "desc");
    List<IngredientInfoDto> result = ingredientQueryRepository.findAllExistingIngredients(params);
    assertThat(result).isSortedAccordingTo(
        Comparator.comparing(IngredientInfoDto::getName).reversed());
  }
}
