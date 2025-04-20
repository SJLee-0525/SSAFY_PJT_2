package com.recipidia.ingredient.service;

import com.recipidia.ingredient.document.IngredientDocument;
import java.util.List;

public interface IngredientDocumentService {

  List<IngredientDocument> findByMorpheme(String morpheme); // morpheme은 형태소

  void deleteIngredientDocumentById(Long id);
}
