package com.recipidia.recipe.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeQueryReq {
    private Long memberId;
    private List<String> ingredients; // 프론트엔드에서 전달받은 main ingredients 목록
}