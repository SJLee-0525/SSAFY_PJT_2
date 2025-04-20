package com.recipidia.recipe.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipidia.recipe.response.RecipeExtractRes;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class RecipeExtractResConverter implements AttributeConverter<RecipeExtractRes, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(RecipeExtractRes extractRes) {
        if (extractRes == null) return null;
        try {
            return objectMapper.writeValueAsString(extractRes);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting RecipeExtractRes to JSON", e);
        }
    }

    @Override
    public RecipeExtractRes convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) return null;
        try {
            return objectMapper.readValue(dbData, RecipeExtractRes.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting JSON to RecipeExtractRes", e);
        }
    }
}
