package com.recipidia.recipe.service.impl;

import com.recipidia.filter.entity.MemberFilter;
import com.recipidia.filter.repository.MemberFilterRepository;
import com.recipidia.filter.service.IngredientFilterService;
import com.recipidia.member.entity.MemberRecipe;
import com.recipidia.member.repository.MemberRecipeRepository;
import com.recipidia.recipe.converter.RecipeQueryResConverter;
import com.recipidia.recipe.dto.RecipeDetailDto;
import com.recipidia.recipe.dto.RecipeDto;
import com.recipidia.recipe.dto.VideoInfo;
import com.recipidia.recipe.entity.Recipe;
import com.recipidia.recipe.entity.RecipeIngredient;
import com.recipidia.recipe.exception.NoRecipeException;
import com.recipidia.recipe.repository.RecipeRepository;
import com.recipidia.recipe.request.RecipeQueryReq;
import com.recipidia.recipe.response.RecipeExtractRes;
import com.recipidia.recipe.response.RecipeQueryCustomResponse;
import com.recipidia.recipe.response.RecipeQueryRes;
import com.recipidia.recipe.response.VideoInfoCustomResponse;
import com.recipidia.recipe.service.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;

import java.util.*;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {

  private final IngredientFilterService ingredientFilterService;
  private final WebClient webClient;
  private final RecipeRepository recipeRepository;
  private final MemberRecipeRepository memberRecipeRepository;
  private final MemberFilterRepository memberFilterRepository;
  private final RecipeQueryResConverter queryResConverter = new RecipeQueryResConverter();

  private static final String RECIPE_NOT_FOUND_MSG = "Recipe not found";


  @Override
  @Transactional
  public Mono<ResponseEntity<RecipeQueryRes>> handleRecipeQuery(RecipeQueryReq request) {

    // 1. 사용자 필터 정보 조회 단계 (MemberFilter 체크)
    Mono<MemberFilter> memberFilterMono = fetchMemberFilter(request.getMemberId());

    // 2. 식단 기반 재료 필터링 단계
    Mono<IngredientFilterService.FilteredIngredientResult> filteredIngredientsMono = filterIngredientsByDietaries(memberFilterMono, request.getIngredients());

    // 3. FastAPI 호출 단계
    return callFastApi(filteredIngredientsMono, memberFilterMono, request);
  }

  // 멤버-필터 체크 함수
  private Mono<MemberFilter> fetchMemberFilter(Long memberId) {
    return Mono.fromCallable(() -> memberFilterRepository.findByMemberId(memberId)
            .orElseThrow(() -> new RuntimeException("Member filter not found for memberId: " + memberId)))
        .subscribeOn(Schedulers.boundedElastic());
  }

  // 멤버-필터의 식단 설정에 따라 냉장고의 식재료들을 필터링합니다.
  private Mono<IngredientFilterService.FilteredIngredientResult> filterIngredientsByDietaries(Mono<MemberFilter> memberFilterMono, List<String> mainIngredients) {
    return memberFilterMono.flatMap(memberFilter ->
        Mono.fromCallable(() -> ingredientFilterService.filterIngredientsByDietaries(
                memberFilter.getFilterData().getDietaries(),
                mainIngredients,
                memberFilter.getFilterData().getAllergies()
            ))
            .subscribeOn(Schedulers.boundedElastic())
    );
  }

  // FastAPI를 호출해 레시피 검색 결과 응답을 받아옵니다.
  private Mono<ResponseEntity<RecipeQueryRes>> callFastApi(
      Mono<IngredientFilterService.FilteredIngredientResult> filteredIngredientsMono,
      Mono<MemberFilter> memberFilterMono,
      RecipeQueryReq request
  ) {
    return Mono.zip(filteredIngredientsMono, memberFilterMono)
        .flatMap(tuple -> {
          IngredientFilterService.FilteredIngredientResult result = tuple.getT1();
          MemberFilter memberFilter = tuple.getT2();

          Set<String> combinedPreferredIngredients = new HashSet<>(memberFilter.getFilterData().getPreferredIngredients());
          combinedPreferredIngredients.addAll(result.preferredIngredients());

          Map<String, Object> payload = new HashMap<>();
          payload.put("ingredients", result.ingredients());
          payload.put("main_ingredients", request.getIngredients());
          payload.put("preferred_ingredients", List.copyOf(combinedPreferredIngredients));
          payload.put("disliked_ingredients", memberFilter.getFilterData().getDislikedIngredients());
          payload.put("dietaries", memberFilter.getFilterData().getDietaries());
          payload.put("categories", memberFilter.getFilterData().getCategories());
          payload.put("allergies", memberFilter.getFilterData().getAllergies());

          // 최종 요청 본문 확인
          log.info("🚩 Final Enhanced Payload: {}", payload);

          return webClient.post()
              .uri("/api/f1/query/")
              .contentType(MediaType.APPLICATION_JSON)
              .bodyValue(payload)
              .retrieve()
              .bodyToMono(String.class)
              .map(queryResConverter::convertToEntityAttribute);
        })
        .map(ResponseEntity::ok)
        .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null)));
  }


  @Override
  @Transactional
  public Mono<Void> saveRecipeResult(ResponseEntity<RecipeQueryRes> responseEntity) {
    return Mono.fromRunnable(() -> {
          RecipeQueryRes recipeQueryRes = responseEntity.getBody();
          if (recipeQueryRes == null || recipeQueryRes.getDishes() == null) {
            // 응답이 비어있으면 아무 작업도 하지 않음
            return;
          }
          recipeQueryRes.getDishes().forEach(dish -> processDish(dish, recipeQueryRes));
        }).subscribeOn(Schedulers.boundedElastic())
        .then();
  }

  // 각 요리 이름 별 처리 메소드
  private void processDish(String dish, RecipeQueryRes recipeQueryRes) {
    List<VideoInfo> videoInfos = recipeQueryRes.getVideos().get(dish);
    if (videoInfos == null || videoInfos.isEmpty()) {
      return;
    }
    videoInfos.forEach(videoInfo -> processVideoInfo(dish, videoInfo));
  }

  // 각 비디오 별 처리 메소드
  private void processVideoInfo(String dish, VideoInfo videoInfo) {
    String youtubeUrl = videoInfo.getUrl();

    // 기존 레시피는 업데이트, 신규 레시피는 빌드해서 저장
    Recipe recipe = recipeRepository.findByYoutubeUrl(youtubeUrl)
        .map(existingRecipe -> {
          existingRecipe.updateFromVideoInfo(videoInfo); // 기존 레시피 업데이트
          return existingRecipe;
        })
        .orElseGet(() -> Recipe.builder()
            .youtubeUrl(youtubeUrl)
            .name(dish)
            .hasCaption(videoInfo.getHasCaption())
            .title(videoInfo.getTitle())
            .channelTitle(videoInfo.getChannelTitle())
            .duration(videoInfo.getDuration())
            .viewCount(videoInfo.getViewCount())
            .likeCount(videoInfo.getLikeCount())
            .build());

    recipeRepository.save(recipe);
  }

  @Override
  public Mono<RecipeQueryCustomResponse> mapQueryResponse(ResponseEntity<RecipeQueryRes> responseEntity, Long memberId) {
    RecipeQueryRes queryRes = responseEntity.getBody();
    if (queryRes == null) {
      return Mono.error(new RuntimeException("Response body is null"));
    }

    return Flux.fromIterable(queryRes.getVideos().entrySet())
        .flatMap(entry -> {
          String dish = entry.getKey();
          List<VideoInfo> videoList = entry.getValue();
          return Flux.fromIterable(videoList)
              .flatMap(video -> convertVideoInfo(video, memberId))
              .collectList()
              .map(videoInfoList -> Tuples.of(dish, videoInfoList));
        })
        .collectMap(Tuple2::getT1, Tuple2::getT2)
        .map(videosMap -> RecipeQueryCustomResponse.builder()
            .dishes(queryRes.getDishes())
            .videos(videosMap)
            .build());
  }

  private Mono<VideoInfoCustomResponse> convertVideoInfo(VideoInfo video, Long memberId) {
    return Mono.fromCallable(() -> recipeRepository.findIdByYoutubeUrl(video.getUrl()))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(recipeId ->
            Mono.fromCallable(() -> memberRecipeRepository.findByMemberIdAndRecipeId(memberId, recipeId))
                .subscribeOn(Schedulers.boundedElastic())
                .map(optionalMemberRecipe -> {
                  Boolean favorite = false;
                  Integer rating = 0;
                  if (optionalMemberRecipe.isPresent()) {
                    MemberRecipe memberRecipe = optionalMemberRecipe.get();

                    favorite = Optional.ofNullable(memberRecipe.getFavorite()).orElse(false);
                    rating = Optional.ofNullable(memberRecipe.getRating()).orElse(0);
                  }
                  return VideoInfoCustomResponse.builder()
                      .recipeId(recipeId)
                      .title(video.getTitle())
                      .url(video.getUrl())
                      .channelTitle(video.getChannelTitle())
                      .duration(video.getDuration())
                      .viewCount(video.getViewCount())
                      .likeCount(video.getLikeCount())
                      .hasCaption(video.getHasCaption())
                      .favorite(favorite)
                      .rating(rating)
                      .build();
                })
        );
  }

  @Override
  @Transactional(readOnly = true)
  public Mono<ResponseEntity<List<RecipeDto>>> getAllRecipes() {
    return Mono.fromCallable(recipeRepository::findAllWithIngredients)
        .subscribeOn(Schedulers.boundedElastic())
        .publishOn(Schedulers.parallel())
        .map(list -> list.stream()
            .map(RecipeDto::fromEntity)
            .toList())
        .map(ResponseEntity::ok)
        .doOnNext(resp -> log.info("getAllRecipes result size={}",
            Optional.ofNullable(resp.getBody()).map(List::size).orElse(0)))
        .doOnError(e -> log.error("getAllRecipes failed", e))
        .onErrorResume(e ->
            Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build())
        );
  }

  @Override
  @Transactional
  public Mono<RecipeExtractRes> extractRecipe(Long recipeId) {
    return Mono.justOrEmpty(recipeRepository.findById(recipeId))
        .switchIfEmpty(Mono.error(new NoRecipeException(RECIPE_NOT_FOUND_MSG)))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(recipe -> {
          if (recipe.getTextRecipe() != null) {
            return Mono.just(recipe.getTextRecipe());
          }
          Map<String, String> payload = new HashMap<>();
          payload.put("youtube_url", recipe.getYoutubeUrl());
          return webClient.post()
              .uri("/api/f1/recipe/")
              .contentType(MediaType.APPLICATION_JSON)
              .bodyValue(payload)
              .exchangeToMono(response -> {
                int status = response.statusCode().value();
                // 상태 코드가 430 또는 432인 경우 더미 RecipeExtractRes 반환
                if (status == 430 || status == 432) {
                  return response.bodyToMono(String.class)
                      .defaultIfEmpty("")
                      .flatMap(errorMsg -> {
                        String title = "영상 자막이 레시피를 추출하는데 적합하지 않습니다.";
                        return updateHasCaptionFalse(recipeId) // hasCaption 값을 false로 바꾼 뒤
                            .thenReturn(RecipeExtractRes.createDummy(title)); // 더미 데이터 반환
                      });
                } else {
                  return response.bodyToMono(RecipeExtractRes.class);
                }
              });
        });
  }

  // 더미 데이터 반환 시 레시피의 HasCaption 값을 false로 변경
  private Mono<Recipe> updateHasCaptionFalse(Long recipeId) {
    return Mono.fromCallable(() -> {
      Recipe recipe = recipeRepository.findById(recipeId)
          .orElseThrow(() -> new NoRecipeException(RECIPE_NOT_FOUND_MSG));
      recipe.noCaption();
      return recipeRepository.save(recipe);
    }).subscribeOn(Schedulers.boundedElastic());
  }


  @Override
  @Transactional
  public Mono<Void> saveExtractResult(Long recipeId, RecipeExtractRes extractRes) {
    return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(optionalRecipe -> {
          if (optionalRecipe.isEmpty()) {
            return Mono.error(new NoRecipeException(RECIPE_NOT_FOUND_MSG));
          }
          Recipe recipe = optionalRecipe.get();
          // 추출 결과 전체를 RecipeExtractRes로 저장
          recipe.modifyTextRecipe(extractRes);
          // 기존 ingredients 업데이트 (필요 시)
          recipe.getIngredients().clear();
          extractRes.getIngredients().forEach(ingredient -> {
            RecipeIngredient ingredientEntity = RecipeIngredient.builder()
                .recipe(recipe)
                .name(ingredient.getName())
                .quantity(ingredient.getQuantity())
                .build();
            recipe.getIngredients().add(ingredientEntity);
          });
          return Mono.fromCallable(() -> recipeRepository.save(recipe))
              .subscribeOn(Schedulers.boundedElastic())
              .then();
        });
  }

  @Override
  public Mono<RecipeDetailDto> getRecipeDetail(Long recipeId, RecipeExtractRes extractRes) {
    return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(optionalRecipe -> {
          if (optionalRecipe.isEmpty()) {
            return Mono.error(new NoRecipeException(RECIPE_NOT_FOUND_MSG));
          }
          Recipe recipe = optionalRecipe.get();
          RecipeDetailDto dto = RecipeDetailDto.fromEntities(recipe, extractRes);
          return Mono.just(dto);
        });
  }

  @Override
  public Mono<RecipeDetailDto> getCurrentRecipeDetail(Long recipeId) {
    return Mono.fromCallable(() -> recipeRepository.findByIdWithIngredients(recipeId))
        .subscribeOn(Schedulers.boundedElastic())
        .flatMap(optionalRecipe -> {
          if (optionalRecipe.isEmpty()) {
            return Mono.error(new NoRecipeException(RECIPE_NOT_FOUND_MSG));
          }
          Recipe recipe = optionalRecipe.get();
          // textRecipe가 없으면 빈 RecipeExtractRes를 생성하거나 null을 사용 (DTO 설계에 따라 선택)
          RecipeExtractRes extractRes = recipe.getTextRecipe();
          RecipeDetailDto dto = RecipeDetailDto.fromEntities(recipe, extractRes);
          return Mono.just(dto);
        });
  }


}
