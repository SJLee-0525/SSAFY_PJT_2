package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.document.IngredientDocument;
import com.recipidia.ingredient.repository.IngredientDocumentRepository;
import com.recipidia.ingredient.service.IngredientDocumentService;
import jakarta.annotation.PostConstruct;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IngredientDocumentServiceImpl implements IngredientDocumentService {

  private final IngredientDocumentRepository ingredientDocumentRepository;
  private final JdbcTemplate jdbcTemplate;

  @PostConstruct
  public void indexIngredients() {
    List<IngredientDocument> ingredientDocuments = jdbcTemplate.query(
        "select * from ingredient_info",
        (rs, rowNum) -> {
          IngredientDocument ingredientDocument = new IngredientDocument();
          ingredientDocument.setId(rs.getLong("id"));
          ingredientDocument.setName(rs.getString("name"));
          ingredientDocument.setImageUrl(rs.getString("image_url"));
          return ingredientDocument;
        }
    );
    ingredientDocumentRepository.saveAll(ingredientDocuments);
  }

  @Override
  public List<IngredientDocument> findByMorpheme(String morpheme) {
    return ingredientDocumentRepository.findByTermUsingWildCard(morpheme);
  }

  @Override
  public void deleteIngredientDocumentById(Long id) {
    ingredientDocumentRepository.deleteById(id);
  }
}
