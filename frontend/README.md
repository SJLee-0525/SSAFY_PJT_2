# RECIPEDIA Frontend

<img src="/uploads/350bf6bbb93dbe34f7fb9cf9f61b5f00/recipediaLogo.png" width="50%" alt="레시피디아 로고"/>

## 🧰 사용 기술 스택

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **UI**: TailwindCSS
- **State Management**: Zustand
- **API 통신**: Axios + React Query
- **비동기 처리 및 오류 복구**: React Query + React Error Boundary
- **환경 구성**: Vite 환경변수 시스템 (`.env`)
- **기타 도구**: MSW(Mock Service Worker), ESLint, Prettier

---

## 📁 디렉토리 구조 (주요 폴더 기준)

```bash
src/
├── apis/                     # Axios 기반 API 모듈
├── assets/                   # 이미지, 폰트, 사운드 리소스
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   │   ├── loading/
│   │   ├── logo/
│   │   └── noIngredient/
│   └── sounds/
├── components/               # 공통 UI 컴포넌트 및 모듈
│   ├── common/               # 버튼, 모달, 입력창 등 공통 요소
│   │   ├── button/
│   │   ├── error/
│   │   ├── input/
│   │   ├── keypad/
│   │   │   └── components/
│   │   ├── loading/
│   │   ├── modal/
│   │   ├── timer/
│   │   ├── toggle/
│   │   └── videoInfo/
│   ├── Layout/
│   ├── profile/
│   └── recipeRating/
├── data/                     # 더미 데이터 또는 고정 상수 관리
├── hooks/                    # 커스텀 훅 정의
├── mocks/                    # MSW(Mock Service Worker) 관련 설정
├── pages/                    # 라우팅되는 실제 페이지들
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── auth.css
│   ├── detailIngredient/
│   │   ├── DetailIngredientModal.tsx
│   │   └── components/
│   ├── detailRecipe/
│   │   ├── DetailRecipePage.tsx
│   │   └── components/
│   ├── home/
│   │   ├── HomePage.tsx
│   │   ├── Home.css
│   │   └── components/
│   ├── myRecipe/
│   │   ├── MyRecipePage.tsx
│   │   └── components/
│   ├── preference/
│   │   ├── PreferencePage.tsx
│   │   └── components/
│   ├── recipeList/
│   │   ├── RecipeListPage.tsx
│   │   └── components/
│   ├── setting/
│   │   ├── SettingPage.tsx
│   │   └── components/
│   ├── storeIngredient/
│   │   ├── StoreConfirmModal.tsx
│   │   ├── StoreIngredientModal.tsx
│   │   └── components/
│   └── takeoutIngredient/
│       ├── TakeoutConfirmModal.tsx
│       ├── TakeoutIngredientModal.tsx
│       └── components/
├── stores/                   # Zustand 기반 전역 상태 관리
├── styles/                   # Tailwind 및 공통 스타일 정의
├── types/                    # 전역 타입 정의
├── utils/                    # 유틸 함수 모음
├── main.tsx                  # 앱 진입점
└── App.tsx                   # 라우터 및 글로벌 셋업
```

---

## 🧠 상태 관리 구조

- **Zustand**로 전역 상태 관리 (예: 로그인, 재료 목록, 모달 상태 등)
- **React Query**로 서버 상태를 캐싱하고 요청 흐름을 단순화
- **React Error Boundary**로 컴포넌트 단위 예외 핸들링 처리

---

## 🔐 API 통신 및 환경 구성

- `.env` 파일을 통해 `VITE_API_URL` 및 릴리즈용 URL 설정

```env
VITE_API_URL=https://j12s003.p.ssafy.io/api
VITE_RELEASE_API_URL=https://j12s003.p.ssafy.io/api
```

- `/apis` 디렉토리에서 Axios 기반 API 모듈화 및 도메인 분리 적용

---

## 🧩 페이지 구성 요약

| 경로                      | 설명                                 |
|---------------------------|--------------------------------------|
| `/`                       | 홈 화면 (재료 선택/입출고)          |
| `/login`                   | 로그인 화면                |
| `/myRecipe`               | 즐겨찾기한 레시피 목록              |
| `/detailRecipe/:id`       | 레시피 상세 페이지, 영상+단계 포함  |
| `/recipeList`             | 생성된 레시피 리스트 페이지         |
| `/setting`                | 사용자 프로필 화면          |

---

## 🧪 개발 편의 기능

- **MSW**: API Mocking으로 독립적인 프론트 개발 가능
- **Vite**: 빠른 빌드 및 HMR 지원
- **ESLint + Prettier**: 코드 품질 및 포맷 일관성 유지

---

## ✨ UX 설계 포인트

- 로딩 애니메이션 활용
- 오류 시 사용자 안내 문구 출력
- 페이지 간 전환 시 상태 초기화
- 자동 스크롤, 타임스탬프, 타이머 등 요리 특화 UX 제공


## 🪝 주요 커스텀 훅 (hooks/)

| 훅 이름                | 기능 요약                                      |
|------------------------|-------------------------------------------------|
| `useDebounceHook`      | 입력 지연 처리를 통해 API 호출 최적화         |
| `useIngredientsHooks`  | 재료 검색, 선택, 입출고 로직 통합 관리         |
| `useRecipeHooks`       | 추천 요청, 생성된 레시피 리스트 핸들링         |
| `useRecipeDetail`      | 개별 레시피 상세 조회 및 상태 관리             |
| `useTimerManager`      | 요리 단계별 타이머 제어 및 UI 연동             |
| `useUserHook`          | 로그인 사용자 정보 및 선호/비선호 재료 연동    |

---

## 🧾 Zustand 상태 관리 (stores/)

| 스토어 파일           | 전역 상태 요약                                   |
|------------------------|--------------------------------------------------|
| `userStore.ts`         | 로그인 여부, 사용자 정보, 선호 설정              |
| `modalStore.ts`        | 전역 모달 열림/닫힘 상태 및 모달 타입            |
| `ingredientsStore.ts`  | 보유 중인 식재료 목록 및 선택 상태               |
| `recipeStore.ts`       | 생성된 레시피 리스트 및 상세 상태                |

---

## 📐 타입 정의 전략 (types/)

- 모든 API 요청/응답 및 UI 구성 요소는 전역 타입 파일로 분리 관리합니다.

| 타입 파일              | 주요 역할                                         |
|------------------------|--------------------------------------------------|
| `ingredientsTypes.ts`  | 재료 관련 요청/응답 및 구조 정의                |
| `recipeListTypes.ts`   | 레시피 리스트 응답 타입 및 상태 정의            |
| `userTypes.ts`         | 사용자 정보, 토큰 응답, 선호 필드                |
| `filterTypes.ts`       | 필터 조건에 대한 타입 구성                       |
| `commonProps.ts`       | 컴포넌트 공통 Props 정의 (예: 버튼, 카드 등)    |
| `iconProps.ts`         | 아이콘 관련 Props 타입 정의                      |

## 🧩 공통 컴포넌트 구조 (components/common/)

| 폴더 이름       | 주요 컴포넌트                                 |
|----------------|-----------------------------------------------|
| `button`       | `Button`, `FilterButton`, `IngredientButton`: 다양한 버튼 스타일을 위한 컴포넌트 |
| `error`        | `ErrorPage`: 오류 발생 시 표시되는 기본 에러 페이지 컴포넌트 |
| `input`        | `Input`, `IngredientInput`, `DateInput`: 텍스트/날짜 입력 전용 필드 |
| `keypad`       | `Keypad`: 재료 수량 조절 등을 위한 커스텀 키패드 UI |
| `loading`      | `LoadingPlayer`: 데이터 로딩 시 표시 |
| `modal`        | `Modal`, `ModalHeader`: 팝업 UI의 레이아웃 및 제목 영역 구성 |
| `timer`        | `TimerManager`, `InlineTimer`, `OpenTimer(Live)`, `TimerCarousel(Live)`: 조리 단계별 타이머 구성 요소 |
| `toggle`       | `Toggle`: ON/OFF 전환 UI |
| `videoInfo`    | `VideoInfo`, `VideoInfoRow(s)`, `VideoInfos`: 유튜브 영상 자막 및 정보 리스트 렌더링 |

---

## 🛠 주요 유틸 함수 (utils/)

| 유틸 함수 파일                    | 설명                                           |
|----------------------------------|------------------------------------------------|
| `getFormattedDate.ts`            | 날짜 포맷 변환 함수 (ex: yyyy-mm-dd 등 처리)   |
| `getYoutubeThumbnailUrl.ts`      | 유튜브 영상 썸네일 URL 생성                   |
| `navigationEvent.ts`             | 라우터 이동 시 네비게이션 이벤트 핸들러 |