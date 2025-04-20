package com.recipidia.recipe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @JsonBackReference
    private Recipe recipe;

    @Column
    private String name;

    @Column
    private String quantity;

    @Builder
    public RecipeIngredient(Recipe recipe, String name, String quantity) {
        this.recipe = recipe;
        this.name = name;
        this.quantity = quantity;
    }

}
