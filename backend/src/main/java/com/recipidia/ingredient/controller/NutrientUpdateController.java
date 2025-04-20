package com.recipidia.ingredient.controller;

import com.recipidia.ingredient.scheduler.NutrientUpdateScheduler;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/schedule")
public class NutrientUpdateController {

    private final NutrientUpdateScheduler nutrientUpdateScheduler;

    public NutrientUpdateController(NutrientUpdateScheduler nutrientUpdateScheduler) {
        this.nutrientUpdateScheduler = nutrientUpdateScheduler;
    }

    @Operation(
            summary = "식재료 영양성분 메뉴얼 업데이트",
            description = "영양성분을 업데이트 하는 스케줄러를 즉시 실행합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "재료 정보 업데이트 성공"),
                    @ApiResponse(responseCode = "500", description = "재료 정보 업데이트 실패"),
            }
    )
    @GetMapping("/nutrient")
    public ResponseEntity<String> triggerNutrientUpdate() {
        try {
            // 스케줄러 작업을 즉시 실행
            nutrientUpdateScheduler.updateMissingNutrients();
            return new ResponseEntity<>("Nutrient update job executed successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to execute nutrient update job: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
