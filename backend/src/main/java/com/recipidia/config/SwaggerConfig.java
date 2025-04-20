package com.recipidia.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    tags = {
        @Tag(name = "ingredient-controller", description = "식재료 관리 API"),
        @Tag(name = "ingredient-find-controller", description = "식재료 검색(자동완성) API"),
        @Tag(name = "recipe-controller", description = "레시피 관련 API"),
        @Tag(name = "member-controller", description = "회원 관리 API"),
        @Tag(name = "member-recipe-controller", description = "회원 즐겨찾기/별점 API"),
        @Tag(name = "member-filter-controller", description = "회원 개인화 필터 API"),
        @Tag(name = "nutrient-update-controller", description = "영양성분 업데이트 API"),
        @Tag(name = "ingredient-info-controller", description = "식재료 정보 삭제 API(관리자 용)"),
        @Tag(name = "deprecated-controller", description = "사용되지 않는 API")
    }
)
public class SwaggerConfig { }
