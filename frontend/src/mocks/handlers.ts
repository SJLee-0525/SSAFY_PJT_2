//mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { INGREDIENTS, SEARCH_INGREDIENTS_INFO } from "@/data/INGREDIENTS";
import { INGREDIENT_WITH_NUTRITIONS } from "@/data/NUTRITIONS";
import { USERS } from "@/data/USERS";
import RECIPE_LIST, { PAGENATION_RECIPE_LIST } from "@/data/RECIPE_LIST";
import { DETAIL_RECIPE, DETAIL_RECIPE_CHECK } from "@/data/DETAIL_RECIPE";

const { VITE_API_URL } = import.meta.env;

const handlers = [
  // 고내에 저장된 재료 목록 조회
  http.get(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json(INGREDIENTS);
  }),

  // 재료 입고
  http.post(VITE_API_URL + "/v1/ingredient", () => {
    return HttpResponse.json({ message: "재료가 성공적으로 입고되었습니다." });
  }),

  // 재료 자동완성 검색 (안 변하는 게 정상입니다)
  http.get(VITE_API_URL + "/v1/ingredient/search?req=:inputValue", () => {
    return HttpResponse.json(SEARCH_INGREDIENTS_INFO);
  }),

  // 재료 상세 조회
  http.get(VITE_API_URL + "/v1/ingredient/nutrient/:ingredientId", () => {
    return HttpResponse.json(INGREDIENT_WITH_NUTRITIONS);
  }),

  // 재료 삭제
  http.delete(VITE_API_URL + "/v1/ingredient/release", () => {
    return HttpResponse.json({
      사과: 1,
      대파: 1,
    });
  }),

  //레시피 목록 조회
  http.post(VITE_API_URL + "/v1/recipe", () => {
    return HttpResponse.json(RECIPE_LIST);
  }),

  // //레시피 추출
  http.get(VITE_API_URL + "/v1/recipe/:recipeId", () => {
    return HttpResponse.json(DETAIL_RECIPE);
  }),

  // //단일 레시피 조회
  http.get(VITE_API_URL + "/v1/recipe/:recipeId/check", () => {
    return HttpResponse.json(DETAIL_RECIPE_CHECK);
  }),

  //사용자 목록 조회
  http.get(VITE_API_URL + "/v1/member", () => {
    return HttpResponse.json(USERS);
  }),

  // 사용자 추가
  http.post(VITE_API_URL + "/v1/member", () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      membername: "새로운 사용자",
    });
  }),

  //사용자 이름 수정
  http.put(VITE_API_URL + "/v1/member/:id", () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      membername: "이름 수정",
    });
  }),

  // 사용자 삭제
  http.delete(VITE_API_URL + "/v1/member/:id", () => {
    return HttpResponse.json({
      message: "사용자가 성공적으로 삭제되었습니다.",
    });
  }),

  // 필터 정보 조회
  http.get(VITE_API_URL + "/v1/filter/:id", () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      filterData: {
        categories: ["한식", "중식", "일식", "양식"],
        dietaries: ["고단백식", "고열량식", "저염식", "저당식"],
        preferredIngredients: ["사과", "대파"],
        dislikedIngredients: ["양파", "고추"],
        allergies: ["견과류", "계란", "유제품", "조개류"],
      },
    });
  }),

  // 필터 정보 저장
  http.put(VITE_API_URL + "/v1/filter/:id", () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      filterData: {
        categories: ["한식", "중식", "일식", "양식"],
        dietaries: ["고단백식", "고열량식", "저염식", "저당식"],
        preferredIngredients: ["사과", "대파"],
        dislikedIngredients: ["양파", "고추"],
        allergies: ["견과류", "계란", "유제품", "조개류"],
      },
    });
  }),

  //레시피 평가 및 즐겨찾기 기능
  http.patch(VITE_API_URL + "/v1/member/recipe/:recipeId", () => {
    return HttpResponse.json({
      memberId: 2,
      recipeId: 12,
      rating: 4,
      favorite: true,
      createdAt: "2025-03-24T10:15:30",
    });
  }),

  http.get(VITE_API_URL + "/v1/member/recipe/:memberId/ratings?page=:page", () => {
    return HttpResponse.json(PAGENATION_RECIPE_LIST);
  }),

  http.get(VITE_API_URL + "/v1/member/recipe/:memberId/favorites?page=:page", () => {
    return HttpResponse.json(PAGENATION_RECIPE_LIST);
  }),
];

export default handlers;
