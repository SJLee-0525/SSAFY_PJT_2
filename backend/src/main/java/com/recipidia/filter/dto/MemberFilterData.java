package com.recipidia.filter.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberFilterData {
  private List<String> categories;
  private List<String> dietaries;
  private List<String> preferredIngredients;
  private List<String> dislikedIngredients;
  private List<String> allergies;
}