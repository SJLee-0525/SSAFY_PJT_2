package com.recipidia.recipe.response;

import com.recipidia.recipe.dto.VideoInfo;
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
public class RecipeQueryRes {

  private List<String> dishes;
  private Map<String, List<VideoInfo>> videos;
}