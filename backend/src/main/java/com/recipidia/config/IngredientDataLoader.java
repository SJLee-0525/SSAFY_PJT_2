package com.recipidia.config;

import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.entity.IngredientNutrient;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class IngredientDataLoader implements CommandLineRunner {

    @Value("${host.url}")
    private String hostUrl;

    private final IngredientInfoRepository ingredientInfoRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (ingredientInfoRepository.count() > 0) return; // 이미 데이터 있으면 실행 안 함

        try (InputStream is = new ClassPathResource("data/ingredients_db.csv").getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {

            String line = reader.readLine(); // 헤더 읽기 (skip)
            while ((line = reader.readLine()) != null) {
                String[] tokens = line.split(",");

                // CSV 데이터 컬럼 순서대로
                String name = tokens[0].trim();
                float calories = parseFloat(tokens[1]);
                float carbohydrate = parseFloat(tokens[2]);
                float protein = parseFloat(tokens[3]);
                float fat = parseFloat(tokens[4]);
                float sodium = parseFloat(tokens[5]);
                float sugars = parseFloat(tokens[6]);
                float cholesterol = parseFloat(tokens[7]);
                float saturatedFat = parseFloat(tokens[8]);
                float unsaturatedFat = parseFloat(tokens[9]);
                float transFat = parseFloat(tokens[10]);
                // allergen_info는 마지막 컬럼이므로, 11번 인덱스 이후의 모든 토큰을 합칩니다.
                StringBuilder allergenInfoBuilder = new StringBuilder();
                for (int i = 11; i < tokens.length; i++) {
                    if (i > 11) {
                        allergenInfoBuilder.append(",");
                    }
                    allergenInfoBuilder.append(tokens[i]);
                }
                String allergenInfo = allergenInfoBuilder.toString().trim();

// 큰따옴표로 감싸져 있다면 제거합니다.
                if (allergenInfo.startsWith("\"") && allergenInfo.endsWith("\"")) {
                    allergenInfo = allergenInfo.substring(1, allergenInfo.length() - 1);
                }

                if (!ingredientInfoRepository.existsByName(name)) {
                    IngredientInfo ingredientInfo = new IngredientInfo(name, buildImgUrl(name));

                    IngredientNutrient nutrient = IngredientNutrient.builder()
                            .calories(calories)
                            .carbohydrate(carbohydrate)
                            .protein(protein)
                            .fat(fat)
                            .sodium(sodium)
                            .sugars(sugars)
                            .cholesterol(cholesterol)
                            .saturatedFat(saturatedFat)
                            .unsaturatedFat(unsaturatedFat)
                            .transFat(transFat)
                            .allergenInfo(allergenInfo)
                            .build();

                    ingredientInfo.attachIngredientNutrients(nutrient);
                    ingredientInfoRepository.save(ingredientInfo);
                }
            }
        }
    }

    private float parseFloat(String value) {
        try {
            return Float.parseFloat(value);
        } catch (Exception e) {
            return 0f; // 빈 값 또는 파싱 에러 시 0 반환
        }
    }

    private String buildImgUrl(String name) {
        return String.format("%s/images/ingredients/%s.jpg", hostUrl, name);
    }
}

