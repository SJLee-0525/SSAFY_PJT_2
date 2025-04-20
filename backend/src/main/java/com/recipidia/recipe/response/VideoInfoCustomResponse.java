package com.recipidia.recipe.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VideoInfoCustomResponse {
  private long recipeId;
  private String title;
  private String url;
  private String channelTitle;
  private String duration;
  private Long viewCount;
  private Long likeCount;
  private Boolean hasCaption;
  private Boolean favorite;
  private Integer rating;
}
