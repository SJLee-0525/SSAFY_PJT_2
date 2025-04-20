package com.recipidia.ingredient.document;

import com.recipidia.ingredient.entity.IngredientInfo;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "ingredient")
public class IngredientDocument {

  @Id
  private Long id;

  @Field(type = FieldType.Text)
  private String name;

  @Field(type = FieldType.Text)
  private String imageUrl;

  public static IngredientDocument fromEntity(IngredientInfo ingredientInfo) {
    return new IngredientDocument(ingredientInfo.getId(), ingredientInfo.getName(), ingredientInfo.getImageUrl());
  }
}
