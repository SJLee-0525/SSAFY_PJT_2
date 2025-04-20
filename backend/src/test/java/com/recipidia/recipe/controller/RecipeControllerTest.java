package com.recipidia.recipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeQueryCustomResponse;
import com.recipidia.recipe.response.RecipeQueryRes;
import com.recipidia.recipe.service.RecipeService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

@WebFluxTest(controllers = RecipeController.class)
@Import(RecipeControllerTest.MockConfig.class)
class RecipeControllerTest {

  @TestConfiguration
  static class MockConfig {
    @Bean
    public RecipeService recipeService() {
      return Mockito.mock(RecipeService.class);
    }
  }

  // 필드 주입 (Autowired)
  @org.springframework.beans.factory.annotation.Autowired
  private RecipeService recipeService;

  @org.springframework.beans.factory.annotation.Autowired
  private WebTestClient webTestClient;

  @Test
  void testQueryRecipe() {
    // 변경된 RecipeQueryReq: 첫번째 인자는 memberId, 두번째 인자는 ingredients 목록
    RecipeQueryReq request = new RecipeQueryReq(1L, List.of("돼지고기", "대파"));

    // 더미 RecipeQueryRes 생성: handleRecipeQuery의 반환 타입에 맞춤
    RecipeQueryRes dummyQueryRes = RecipeQueryRes.builder()
        .dishes(List.of("Dummy Dish"))
        .videos(Map.of("Dummy Dish", List.of()))
        .build();
    ResponseEntity<RecipeQueryRes> dummyResponseEntity = ResponseEntity.ok(dummyQueryRes);

    // 최종 mapQueryResponse의 결과로 반환할 RecipeQueryCustomResponse
    RecipeQueryCustomResponse dummyCustomResponse = RecipeQueryCustomResponse.builder()
        .dishes(List.of("Dummy Dish"))
        .videos(Map.of("Dummy Dish", List.of()))
        .build();

    when(recipeService.handleRecipeQuery(any(RecipeQueryReq.class)))
        .thenReturn(Mono.just(dummyResponseEntity));
    when(recipeService.saveRecipeResult(dummyResponseEntity))
        .thenReturn(Mono.empty());
    // memberId를 두 번째 인자로 전달
    when(recipeService.mapQueryResponse(dummyResponseEntity, 1L))
        .thenReturn(Mono.just(dummyCustomResponse));

    webTestClient.post()
        .uri("/api/v1/recipe")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(request)
        .exchange()
        .expectStatus().isOk()
        .expectBody(RecipeQueryCustomResponse.class)
        .value(response -> {
          assertThat(response.getDishes()).containsExactly("Dummy Dish");
          assertThat(response.getVideos()).hasSize(1);
        });
  }

  @Test
  void testGetAllRecipes() {
    RecipeDto recipeDto = new RecipeDto(
        1L,
        "Test Recipe",
        "Test Title",
        "https://www.youtube.com/test",
        false, // hasTextRecipe
        List.of(), // ingredients (비어있음)
        "Test Channel",
        "10:00",
        1000L,
        100L,
        false
    );
    List<RecipeDto> recipes = List.of(recipeDto);
    ResponseEntity<List<RecipeDto>> dummyResponse = ResponseEntity.ok(recipes);

    when(recipeService.getAllRecipes()).thenReturn(Mono.just(dummyResponse));

    webTestClient.get()
        .uri("/api/v1/recipe/check")
        .exchange()
        .expectStatus().isOk()
        .expectBodyList(RecipeDto.class)
        .hasSize(1)
        .value(list -> {
          RecipeDto dto = list.get(0);
          assertThat(dto.recipeId()).isEqualTo(1L);
          assertThat(dto.name()).isEqualTo("Test Recipe");
          assertThat(dto.title()).isEqualTo("Test Title");
          assertThat(dto.youtubeUrl()).isEqualTo("https://www.youtube.com/test");
          assertThat(dto.hasTextRecipe()).isFalse();
          assertThat(dto.channelTitle()).isEqualTo("Test Channel");
          assertThat(dto.duration()).isEqualTo("10:00");
          assertThat(dto.viewCount()).isEqualTo(1000L);
          assertThat(dto.likeCount()).isEqualTo(100L);
        });
  }

  @Test
  void testExtractAndSaveRecipe() {
    RecipeExtractRes extractRes = RecipeExtractRes.builder()
        .title("Extracted Recipe Title")
        .ingredients(List.of(
            new com.recipidia.recipe.response.IngredientQueryRes("마늘", "2개(65g)"),
            new com.recipidia.recipe.response.IngredientQueryRes("양파", "1개(40g)")
        ))
        .cooking_info(null)
        .cooking_tips(null)
        .cooking_sequence(null)
        .build();

    Long recipeId = 1L;
    when(recipeService.extractRecipe(recipeId)).thenReturn(Mono.just(extractRes));
    when(recipeService.saveExtractResult(recipeId, extractRes)).thenReturn(Mono.empty());

    webTestClient.get()
        .uri("/api/v1/recipe/{recipeId}", recipeId)
        .exchange()
        .expectStatus().isOk()
        .expectBody(RecipeExtractRes.class)
        .value(response -> {
          assertThat(response.getTitle()).isEqualTo("Extracted Recipe Title");
          List<String> ingredientNames = response.getIngredients().stream()
              .map(com.recipidia.recipe.response.IngredientQueryRes::getName)
              .toList();
          assertThat(ingredientNames).containsExactly("마늘", "양파");
        });
  }
}
