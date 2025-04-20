package com.recipidia.filter.dto;

public record NutritionCriteria(
    double nutrientValue,
    double multiplier,
    double calories,
    double threshold,
    String nutrientLabel
) {}
