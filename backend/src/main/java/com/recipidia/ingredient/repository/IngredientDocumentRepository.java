package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.document.IngredientDocument;
import java.util.List;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface IngredientDocumentRepository extends
    ElasticsearchRepository<IngredientDocument, Long> {

  @Query("{\"wildcard\": { \"name\": \"*?0*\" }}")
  List<IngredientDocument> findByTermUsingWildCard(String morpheme); // morpheme은 형태소
}
