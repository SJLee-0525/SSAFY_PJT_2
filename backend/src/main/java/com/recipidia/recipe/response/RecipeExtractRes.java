package com.recipidia.recipe.response;

import com.recipidia.recipe.dto.CookingInfo;
import com.recipidia.recipe.dto.CookingStep;
import lombok.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeExtractRes {
  private String title;
  private CookingInfo cooking_info;
  private List<IngredientQueryRes> ingredients;
  private List<String> cooking_tips;
  private Map<String, CookingStep> cooking_sequence;

  public static RecipeExtractRes createDummy(String errorTitle) {
    return RecipeExtractRes.builder()
        .title(errorTitle)
        .cooking_info(new CookingInfo("", 0))
        .ingredients(Collections.singletonList(
            IngredientQueryRes.builder()
                .name(errorTitle)
                .quantity("")
                .build()
        ))
        .cooking_tips(Collections.singletonList(errorTitle))
        .cooking_sequence(Collections.singletonMap(
            errorTitle, new CookingStep(Arrays.asList(""), 0, 0)
        ))
        .build();
  }
}