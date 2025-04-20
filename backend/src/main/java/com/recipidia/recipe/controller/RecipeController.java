package com.recipidia.recipe.controller;

import com.recipidia.recipe.dto.RecipeDetailDto;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeQueryCustomResponse;
import com.recipidia.recipe.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recipe")
@RequiredArgsConstructor
public class RecipeController {

  private final RecipeService recipeService;

  @Operation(
      summary = "레시피 쿼리 요청",
      description = "FIGMA : 레시피 ㅇㅇ 모달",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "레시피 쿼리 요청 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = RecipeQueryReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                              "memberId" : 1,
                              "ingredients": ["돼지고기", "파"]
                          }
                          """
                  )
              }
          )
      ),
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeQueryCustomResponse.class))
          )
      }
  )
  @PostMapping
  public Mono<ResponseEntity<RecipeQueryCustomResponse>> queryRecipe(@RequestBody RecipeQueryReq request) {
    return recipeService.handleRecipeQuery(request)
        .flatMap(responseEntity ->
            recipeService.saveRecipeResult(responseEntity)
                .thenReturn(responseEntity)
        )
        .flatMap(responseEntity -> recipeService.mapQueryResponse(responseEntity, request.getMemberId()))
        .map(ResponseEntity::ok);
  }

  @Operation(
      summary = "전체 레시피 조회",
      description = "FIGMA : 레시피 리스트 페이지?",
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeDto[].class))
          )
      }
  )
  @GetMapping("/check")
  public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
    return recipeService.getAllRecipes();
  }

  @Operation(
      summary = "단일 레시피 조회",
      description = "레시피 ID를 기반으로 단일 레시피 상세 정보를 조회합니다.",
      responses = {
          @ApiResponse(responseCode = "200", description = "레시피 조회 성공",
              content = @Content(schema = @Schema(implementation = RecipeDetailDto.class))
          )
      }
  )
  @GetMapping("/{recipeId}/check")
  public Mono<ResponseEntity<RecipeDetailDto>> getRecipeDetail(@PathVariable Long recipeId) {
    return recipeService.getCurrentRecipeDetail(recipeId)
        .map(ResponseEntity::ok);
  }


  @Operation(
      summary = "특정 레시피 텍스트 추출",
      description = "FIGMA : 레시피 ㅇㅇ ㅇㅇ",
      responses = {
          @ApiResponse(responseCode = "200", description = "텍스트 레시피 추출 성공",
              content = @Content(schema = @Schema(implementation = RecipeDetailDto.class))
          )
      }
  )
  @GetMapping("/{recipeId}")
  public Mono<ResponseEntity<RecipeDetailDto>> extractAndSaveRecipe(@PathVariable Long recipeId) {
    return recipeService.extractRecipe(recipeId)
        .flatMap(extractRes ->
            recipeService.saveExtractResult(recipeId, extractRes)
                .thenReturn(extractRes)
        )
        .flatMap(extractRes -> recipeService.getRecipeDetail(recipeId, extractRes))
        .map(ResponseEntity::ok);
  }
}
