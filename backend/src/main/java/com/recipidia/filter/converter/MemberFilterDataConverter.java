package com.recipidia.filter.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipidia.filter.dto.MemberFilterData;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.io.IOException;
import java.util.List;

@Converter
public class MemberFilterDataConverter implements AttributeConverter<MemberFilterData, String> {
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public String convertToDatabaseColumn(MemberFilterData attribute) {
    if (attribute == null) {
      return "{}";
    }
    try {
      return objectMapper.writeValueAsString(attribute);
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Error converting MemberFilterData to JSON", e);
    }
  }

  @Override
  public MemberFilterData convertToEntityAttribute(String dbData) {
    if (dbData == null || dbData.isEmpty()) {
      return MemberFilterData.builder()
          .categories(List.of())
          .dietaries(List.of())
          .preferredIngredients(List.of())
          .dislikedIngredients(List.of())
          .allergies(List.of())
          .build();
    }
    try {
      return objectMapper.readValue(dbData, MemberFilterData.class);
    } catch (IOException e) {
      throw new IllegalArgumentException("Error converting JSON to MemberFilterData", e);
    }
  }
}
