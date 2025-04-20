package com.recipidia.recipe.service;

import com.recipidia.recipe.dto.RecipeDetailDto;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeQueryCustomResponse;
import com.recipidia.recipe.response.RecipeQueryRes;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;

import java.util.List;

public interface RecipeService {
    Mono<ResponseEntity<RecipeQueryRes>> handleRecipeQuery(RecipeQueryReq request);
    Mono<Void> saveRecipeResult(ResponseEntity<RecipeQueryRes> responseEntity);
    Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes();
    Mono<RecipeExtractRes> extractRecipe(Long recipeId);
    Mono<Void> saveExtractResult(Long recipeId, RecipeExtractRes extractRes);
    Mono<RecipeQueryCustomResponse> mapQueryResponse(ResponseEntity<RecipeQueryRes> responseEntity, Long memberId);
    Mono<RecipeDetailDto> getRecipeDetail(Long recipeId, RecipeExtractRes extractRes);
    Mono<RecipeDetailDto> getCurrentRecipeDetail(Long recipeId);
}
