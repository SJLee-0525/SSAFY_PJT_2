package com.recipidia.ingredient.service.impl;

import com.recipidia.ingredient.document.IngredientDocument;
import com.recipidia.ingredient.dto.IngredientInfoDto;
import com.recipidia.ingredient.dto.IngredientInfoWithNutrientDto;
import com.recipidia.ingredient.dto.IngredientSimpleInfoDto;
import com.recipidia.ingredient.entity.Ingredient;
import com.recipidia.ingredient.entity.IngredientInfo;
import com.recipidia.ingredient.exception.IngredientDeleteException;
import com.recipidia.ingredient.repository.IngredientDocumentRepository;
import com.recipidia.ingredient.repository.IngredientInfoRepository;
import com.recipidia.ingredient.repository.IngredientRepository;
import com.recipidia.ingredient.repository.querydsl.IngredientQueryRepository;
import com.recipidia.ingredient.request.IngredientIncomingReq;
import com.recipidia.ingredient.request.IngredientMultipleDeleteReq;
import com.recipidia.ingredient.request.IngredientUpdateReq;
import com.recipidia.ingredient.response.IngredientIncomingRes;
import com.recipidia.ingredient.response.IngredientUpdateRes;
import com.recipidia.ingredient.service.IngredientService;
import com.recipidia.ingredient.service.NutrientUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IngredientServiceImpl implements IngredientService {

  @Value("${host.url}")
  private String hostUrl;

  private final IngredientInfoRepository ingredientInfoRepository;
  private final IngredientRepository ingredientRepository;
  private final IngredientDocumentRepository ingredientDocumentRepository;
  private final IngredientQueryRepository ingredientQueryRepository;
  private final NutrientUpdateService nutrientUpdateService;

  @Override
  public List<IngredientSimpleInfoDto> getAllIngredientInfo() {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAll();
    return ingredientInfos.stream()
        .map(IngredientSimpleInfoDto::fromEntity)
        .toList();
  }

  @Override
  public List<IngredientInfoDto> findAllExistingIngredients(Map<String, String> filterParam) {
    return ingredientQueryRepository.findAllExistingIngredients(filterParam);
  }

  @Override
  @Transactional
  public IngredientIncomingRes stockItem(IngredientIncomingReq request) {
    // 이름으로 재료를 검색. 있으면 해당 재료를 사용.
    IngredientInfo ingredientInfo = ingredientInfoRepository.findByName(request.getName())
        .orElseGet(() -> {
          String imageUrl = buildImgUrl("noIngredient"); // 기본 이미지로 설정
          return new IngredientInfo(request.getName(), imageUrl);
        });

    // 개수만큼 추가
    List<Ingredient> ingredients = ingredientInfo.getIngredients();
    for (int i = 0; i < request.getAmount(); i++) {
      // 새로운 item 생성
      Ingredient ingredient = Ingredient.builder()
          .storagePlace(request.getStoragePlace())
          .expirationDate(request.getExpirationDate())
          .incomingDate(request.getIncomingDate())
          .ingredientInfo(ingredientInfo)
          .build();
      ingredients.add(ingredient);
    }
    ingredientInfo.setEarliestExpiration();

    // 만약 ingredientInfo가 새로 생성된 객체라면 save 호출
    if (ingredientInfo.getId() == null) { // 새로운 엔티티라면 ID가 null일 것
      // 저장하고 ingredientInfo에 대한 Nutrient 정보도 추가
      ingredientInfoRepository.saveAndFlush(ingredientInfo); // DB에 즉시 반영 : DB에 반영 후 영양 업데이트
      nutrientUpdateService.updateNutrientForIngredient(ingredientInfo);
      // Elasctic Search index에 추가
      ingredientDocumentRepository.save(IngredientDocument.fromEntity(ingredientInfo));
    }

    int validCount = ingredients.size();

    // 저장: 새로운 재료거나 기존 재료에 item 추가된 상태 저장 후 응답
    return IngredientIncomingRes.builder()
        .name(request.getName())
        .storagePlace(request.getStoragePlace())
        .expirationDate(request.getExpirationDate())
        .incomingDate(request.getIncomingDate())
        .amount(validCount)
        .build();
  }

  private String buildImgUrl(String name) {
    return String.format("%s/images/ingredients/%s.jpg", hostUrl, name);
  }

  @Override
  @Transactional
  public IngredientUpdateRes updateItem(Long itemId, IngredientUpdateReq updateDTO) {
    Ingredient ingredient = ingredientRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item not found"));

    ingredient.modifyIngredientInfo(updateDTO);
    return IngredientUpdateRes.fromEntity(ingredient);
  }

  private Map<String, Integer> releaseItems(Long ingredientId, int quantity) {
    // 재료 정보 호출
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);

    // 재료 리스트 불러오기
    List<Ingredient> ingredients = ingredientInfo.getIngredients();

    // 리스트의 수량이 0이면 삭제예외 발생
    if (ingredients.isEmpty()) {
      throw new IngredientDeleteException("재료의 수량이 0개여서 삭제가 불가능합니다");
    }

    // 요청한 수량과 남은 재료 수 중 작은 값을 사용
    int validQuantity = Math.min(quantity, ingredients.size());

    // 출고할 재료 목록: 가장 오래된 미출고 재료부터 validQuantity 개 선택
    List<Ingredient> toRelease = ingredients.subList(0, validQuantity);

    // DB에서 대상 재료들을 배치 삭제
    ingredientRepository.deleteAllInBatch(toRelease);

    // 영속성 컨텍스트 상의 ingredients 컬렉션에서도 삭제 처리
    ingredients.removeAll(toRelease);

    // 남은 재료 수를 계산하여 반환
    int remainCount = ingredients.size();

    return Map.of("remainCount", remainCount);
  }

  @Override
  public IngredientInfoDto getIngredient(Long ingredientId) {
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredients(ingredientId);
    return IngredientInfoDto.fromEntity(ingredientInfo);
  }

  @Override
  @Transactional(readOnly = true)
  public IngredientInfoWithNutrientDto getIngredientInfoWithNutrients(Long id) {
    IngredientInfo ingredientInfo = ingredientInfoRepository.findWithIngredientsAndNutrients(id);
    return IngredientInfoWithNutrientDto.fromEntity(ingredientInfo);
  }

  @Override
  @Transactional
  public Map<String, Integer> releaseMultipleItems(List<IngredientMultipleDeleteReq> requests) {
    Map<String, Integer> remainCounts = new HashMap<>();

    for (IngredientMultipleDeleteReq req : requests) {
      // 이름으로 재료 조회
      IngredientInfo ingredientInfo = ingredientInfoRepository.findByName(req.name())
          .orElseThrow(() -> new IngredientDeleteException("재료 " + req.name() + " 가 존재하지 않습니다."));

      // 기존 단일 출고 메서드 재활용
      Map<String, Integer> result = releaseItems(ingredientInfo.getId(), req.quantity());
      remainCounts.put(req.name(), result.get("remainCount"));
    }
    return remainCounts;
  }

  @Override
  @Transactional(readOnly = true)
  public List<IngredientInfoWithNutrientDto> getAllExistingIngredientsWithNutrients() {
    List<IngredientInfo> ingredientInfos = ingredientInfoRepository.findAllExistingWithIngredientsAndNutrients();
    return ingredientInfos.stream()
        .map(IngredientInfoWithNutrientDto::fromEntity)
        .toList();
  }
}
