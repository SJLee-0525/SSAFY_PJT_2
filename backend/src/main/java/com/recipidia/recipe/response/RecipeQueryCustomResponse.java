package com.recipidia.recipe.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeQueryCustomResponse {
  private List<String> dishes;
  // 각 dish 이름에 해당하는 비디오 리스트 (recipeId 포함)
  private Map<String, List<VideoInfoCustomResponse>> videos;
}
