package com.recipidia.recipe.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.recipidia.recipe.response.RecipeQueryRes;

public class RecipeQueryResConverter {

  private final ObjectMapper objectMapper = new ObjectMapper()
      .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

  public String convertToDatabaseColumn(RecipeQueryRes queryRes) {
    if (queryRes == null) return null;
    try {
      return objectMapper.writeValueAsString(queryRes);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Error converting RecipeQueryRes to JSON", e);
    }
  }

  public RecipeQueryRes convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isEmpty()) return null;
    try {
      return objectMapper.readValue(dbData, RecipeQueryRes.class);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Error converting JSON to RecipeQueryRes", e);
    }
  }
}
