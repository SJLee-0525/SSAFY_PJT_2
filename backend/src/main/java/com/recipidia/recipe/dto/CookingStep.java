package com.recipidia.recipe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookingStep {
  private List<String> sequence;
  private long timestamp; // 필요에 따라 int로도 사용 가능
  private int timer; // 타이머
}