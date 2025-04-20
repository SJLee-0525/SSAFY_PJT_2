package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientSimpleInfoDto;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ingredient/deprecated")
@RequiredArgsConstructor
public class DeprecatedController {

  private final IngredientService ingredientService;

  // 단일 재료 정보 조회
  @Operation(
      summary = "특정 재료 정보 조회",
      description = "FIGMA : 재료 상세 모달",
      responses = {
          @ApiResponse(responseCode = "200", description = "재료 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = IngredientInfoDto.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              {
                              "ingredientInfoId": 1,
                              "name": "대파",
                              "imageUrl": "https://image.com",
                              "totalCount": 2,
                              "ingredients":
                                [
                                  {
                                    "ingredientId": 1,
                                    "storagePlace": "냉장고",
                                    "expirationDate": "2025-03-08T11:00:00",
                                    "incomingDate": "2025-03-01T12:00:00"
                                  },
                                  {
                                    "ingredientId": 2,
                                    "storagePlace": "냉장고",
                                    "expirationDate": "2025-03-08T11:00:00",
                                    "incomingDate": "2025-03-01T12:00:00"
                                  },
                                ]
                              }
                              """
                      )
                  }))
      }
  )
  // ID로 단일 재료 조회
  @GetMapping("/{ingredientId}")
  public IngredientInfoDto getIngredientInfo(@PathVariable Long ingredientId) {
    return ingredientService.getIngredient(ingredientId);
  }

  // 전체 재료 정보 조회
  @Operation(
      summary = "전체 재료 정보 조회",
      description = "FIGMA : 재료 리스트 페이지",
      responses = {
          @ApiResponse(responseCode = "200", description = "재료 정보 조회 성공",
              content = @Content(schema = @Schema(implementation = IngredientInfoDto.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              {
                                "ingredientInfoId": 1,
                                "name": "대파",
                                "imageUrl": "https://image.com",
                                "totalCount": 2
                              }
                              """
                      )
                  }))
      }
  )
  // 전체 재료 및 해당 item 목록 조회
  @GetMapping("/info")
  public List<IngredientSimpleInfoDto> getAllIngredientInfo() {
    return ingredientService.getAllIngredientInfo();
  }

  // item 수정
  @Operation(
      summary = "재료 정보 수정",
      description = "FIGMA : 재료 상세 모달",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "수정할 재료 정보",
          required = true,
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = IngredientUpdateReq.class),
              examples = {
                  @ExampleObject(
                      name = "요청 데이터",
                      value = """
                          {
                          "storagePlace": "냉동실",
                          "expirationDate": "2025-03-07T11:00:00",
                          "incomingDate": "2025-03-02T12:00:00"
                          }
                          """
                  )
              }))
  )
  @PutMapping("/{itemId}")
  public IngredientUpdateRes updateItem(@PathVariable Long itemId,
                                        @RequestBody IngredientUpdateReq updateDTO) {
    return ingredientService.updateItem(itemId, updateDTO);
  }

}