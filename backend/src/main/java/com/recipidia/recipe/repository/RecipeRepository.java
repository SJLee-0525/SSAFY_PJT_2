package com.recipidia.recipe.repository;

import com.recipidia.recipe.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
  Optional<Recipe> findByYoutubeUrl(String youtubeUrl);

  @Query("select distinct r from Recipe r left join fetch r.ingredients")
  List<Recipe> findAllWithIngredients();

  @Query("select r from Recipe r left join fetch r.ingredients where r.id = :id")
  Optional<Recipe> findByIdWithIngredients(@Param("id") Long id);

  @Query("select r.id from Recipe r where r.youtubeUrl = :url")
  Long findIdByYoutubeUrl(@Param("url")String youtubeUrl);

}
