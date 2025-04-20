package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.document.IngredientDocument;
import com.recipidia.ingredient.service.IngredientDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ingredient")
@RequiredArgsConstructor
public class IngredientFindController {

  private final IngredientDocumentService ingredientDocumentService;

  @Operation(
      summary = "재료 이름 자동완성",
      parameters = {
          @Parameter(
              name = "req",
              description = "자동완성 검색어 (한글 형태소 단위)",
              example = "장"
          )
      },
      description = "FIGMA : 선호 재료 필터화면",
      responses = {
          @ApiResponse(responseCode = "200", description = "재료 자동완성 결과 완성",
              content = @Content(schema = @Schema(implementation = IngredientDocument.class),
                  examples = {
                      @ExampleObject(
                          name = "응답 데이터",
                          value = """
                              [
                                   {
                                       "id": 150,
                                       "name": "갈치"
                                   },
                                   {
                                       "id": 52,
                                       "name": "김치"
                                   }
                              ]
                              """
                      )
                  }))
      }
  )
  @GetMapping("/search")
  public List<IngredientDocument> findMatchingIngredient(@RequestParam Map<String, String> searchParam) {
    return ingredientDocumentService.findByMorpheme(searchParam.getOrDefault("req", ""));
  }
}
