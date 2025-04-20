package com.recipidia.ingredient.repository;

import com.recipidia.ingredient.entity.IngredientInfo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientInfoRepository extends JpaRepository<IngredientInfo, Long> {
    boolean existsByName(String name);

    Optional<IngredientInfo> findByName(String name);

    @Query("SELECT distinct i FROM IngredientInfo i "
        + "JOIN FETCH i.ingredients ing ")
    List<IngredientInfo> findAllWithIngredients();

    @Query("select if from IngredientInfo if left join fetch if.ingredients where if.id = :ingredientId")
    IngredientInfo findWithIngredients(Long ingredientId);

    @Query("SELECT i FROM IngredientInfo i "
            + "LEFT JOIN FETCH i.ingredients "
            + "LEFT JOIN FETCH i.ingredientNutrients "
            + "WHERE i.id = :ingredientId")
    IngredientInfo findWithIngredientsAndNutrients(Long ingredientId);

    List<IngredientInfo> findByIngredientNutrientsIsNull();

    @Query("SELECT DISTINCT i FROM IngredientInfo i " +
        "JOIN FETCH i.ingredients ing " +
        "LEFT JOIN FETCH i.ingredientNutrients nut ")
    List<IngredientInfo> findAllExistingWithIngredientsAndNutrients();
}
