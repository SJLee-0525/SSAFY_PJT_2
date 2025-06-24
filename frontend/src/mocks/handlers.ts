import { http, HttpResponse } from "msw";
import { INGREDIENTS, SEARCH_INGREDIENTS_INFO } from "@/data/INGREDIENTS";
import { INGREDIENT_WITH_NUTRITIONS } from "@/data/NUTRITIONS";
import { USERS } from "@/data/USERS";
import RECIPE_LIST, { PAGENATION_RECIPE_LIST } from "@/data/RECIPE_LIST";
import { DETAIL_RECIPE, DETAIL_RECIPE_CHECK } from "@/data/DETAIL_RECIPE";

// 핸들러에는 절대경로만 사용하도록 고정
const API = "/v1";

const handlers = [
  // 고내에 저장된 재료 목록 조회
  http.get(`${API}/ingredient`, () => {
    return HttpResponse.json(INGREDIENTS);
  }),

  // 재료 입고
  http.post(`${API}/ingredient`, () => {
    return HttpResponse.json({ message: "재료가 성공적으로 입고되었습니다." });
  }),

  // 재료 자동완성 검색
  http.get(`${API}/ingredient/search`, ({ request }) => {
    const url = new URL(request.url);
    const inputValue = url.searchParams.get("req");
    console.log("Search inputValue:", inputValue);
    return HttpResponse.json(SEARCH_INGREDIENTS_INFO);
  }),

  // 재료 상세 조회
  http.get(`${API}/ingredient/nutrient/:ingredientId`, () => {
    return HttpResponse.json(INGREDIENT_WITH_NUTRITIONS);
  }),

  // 재료 삭제
  http.delete(`${API}/ingredient/release`, () => {
    return HttpResponse.json({
      사과: 1,
      대파: 1,
    });
  }),

  // 레시피 목록 조회
  http.post(`${API}/recipe`, () => {
    return HttpResponse.json(RECIPE_LIST);
  }),

  // 단일 레시피 조회
  http.get(`${API}/recipe/:recipeId`, () => {
    return HttpResponse.json(DETAIL_RECIPE);
  }),

  // 단일 레시피 상태 확인
  http.get(`${API}/recipe/:recipeId/check`, () => {
    return HttpResponse.json(DETAIL_RECIPE_CHECK);
  }),

  // 사용자 목록 조회
  http.get(`${API}/member`, () => {
    return HttpResponse.json(USERS);
  }),

  // 사용자 추가
  http.post(`${API}/member`, () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      membername: "새로운 사용자",
    });
  }),

  // 사용자 이름 수정
  http.put(`${API}/member/:id`, () => {
    return HttpResponse.json({
      memberId: 9007199254740991,
      membername: "이름 수정",
    });
  }),

  // 사용자 삭제
  http.delete(`${API}/member/:id`, () => {
    return HttpResponse.json({
      message: "사용자가 성공적으로 삭제되었습니다.",
    });
  }),

  // 필터 정보 조회
  http.get(`${API}/filter/:id`, () => {
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
  http.put(`${API}/filter/:id`, () => {
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

  // 레시피 평가 및 즐겨찾기
  http.patch(`${API}/member/recipe/:recipeId`, () => {
    return HttpResponse.json({
      memberId: 2,
      recipeId: 12,
      rating: 4,
      favorite: true,
      createdAt: "2025-03-24T10:15:30",
    });
  }),

  // 사용자의 평가 레시피 목록
  http.get(`${API}/member/recipe/:memberId/ratings`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    console.log("Ratings page:", page);
    return HttpResponse.json(PAGENATION_RECIPE_LIST);
  }),

  // 사용자의 즐겨찾기 레시피 목록
  http.get(`${API}/member/recipe/:memberId/favorites`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    console.log("Favorites page:", page);
    return HttpResponse.json(PAGENATION_RECIPE_LIST);
  }),

  // 로그인
  http.post(`${API}/auth/login`, () => {
    console.log("Mocked login request received");
    return HttpResponse.json({
      status: 200,
      data: "mocked-jwt-token",
    });
  }),
];

export default handlers;
