package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientMultipleDeleteReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.service.IngredientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ingredient")
@RequiredArgsConstructor
public class IngredientController {

  private final IngredientService ingredientService;


  // 재료 입고: 재료가 존재하면 해당 재료에 item 추가, 없으면 새로 생성 후 item 추가
  @Operation(
      summary = "재료 입고",
      description = "FIGMA : 재료 입고 모달",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "입고할 재료 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientIncomingReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                          "name": "대파",
                          "amount": "3",
                          "storagePlace": "냉장고",
                          "expirationDate": "2025-03-08T11:00:00",
                          "incomingDate": "2025-03-01T12:00:00"
                          }
                          """
                  )
              }))
  )
  @PostMapping
  public IngredientIncomingRes stockItem(@RequestBody IngredientIncomingReq request) {
    return ingredientService.stockItem(request);
  }

  // 전체 실제 재료 조회
  @Operation(
      summary = "실제 존재하는 재료 정보 조회",
      description = "FIGMA : 재료 리스트 페이지에서 실제 존재하는 재료 정보만 조회합니다.",
      parameters = {
          @Parameter(in = ParameterIn.QUERY, name = "storage", description = "보관 위치(all, fridge, freezer)", example = "fridge"),
          @Parameter(in = ParameterIn.QUERY, name = "sort", description = "정렬 기준 (expire, name, count, incoming)", example = "name"),
          @Parameter(in = ParameterIn.QUERY, name = "order", description = "정렬 순서 (asc, desc)", example = "asc")
      },
      responses = {
          @ApiResponse(responseCode = "200", description = "실제 존재하는 재료 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = IngredientInfoDto[].class))
          )
      }
  )
  @GetMapping
  public List<IngredientInfoDto> getAllExistingIngredients(@RequestParam Map<String, String> filterParam) {
    return ingredientService.findAllExistingIngredients(filterParam);
  }

  // 다중 items 삭제
  @Operation(
      summary = "다중 재료 출고",
      description = "여러 재료를 동시에 출고하는 기능입니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "출고할 재료들의 이름과 수량 목록",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientMultipleDeleteReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          [
                            {
                              "name": "대파",
                              "quantity": 2
                            },
                            {
                              "name": "당근",
                              "quantity": 3
                            }
                          ]
                          """
                  )
              }))
  )
  @DeleteMapping("/release")
  public Map<String, Integer> releaseMultipleItems(
      @RequestBody @Valid List<IngredientMultipleDeleteReq> requests) {
    return ingredientService.releaseMultipleItems(requests);
  }

  // 영양성분과 같이 보기
  @Operation(
      summary = "특정 재료 영양정보 포함 정보 조회",
      description = "FIGMA : 재료 상세 모달",
      responses = {
          @ApiResponse(responseCode = "200", description = "재료 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = IngredientInfoWithNutrientDto.class))
          )
      }
  )
  @GetMapping("/nutrient/{id}")
  public IngredientInfoWithNutrientDto getIngredientInfoDetail(@PathVariable Long id) {
      return ingredientService.getIngredientInfoWithNutrients(id);
  }

}