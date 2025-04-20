package com.recipidia.ingredient.scheduler;

import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.service.NutrientUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class NutrientUpdateScheduler {

    private final IngredientInfoRepository ingredientInfoRepository;
    private final NutrientUpdateService nutrientUpdateService;

    // 매 정각(초 0, 분 0, 매시)에 실행
    @Scheduled(cron = "0 0 * * * *")
    public void updateMissingNutrients() {
        List<IngredientInfo> ingredientsWithoutNutrient = ingredientInfoRepository.findByIngredientNutrientsIsNull();
        for (IngredientInfo ingredient : ingredientsWithoutNutrient) {
            // NutrientUpdateService를 통해 업데이트 수행
            nutrientUpdateService.updateNutrientForIngredient(ingredient);
        }
    }
}
