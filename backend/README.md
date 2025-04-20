# RECIPEDIA

<img src="/uploads/350bf6bbb93dbe34f7fb9cf9f61b5f00/recipediaLogo.png" width="50%" alt="레시피디아 로고"/>

## 프로젝트 개요

### 📋 **서비스 개요**

- 생성형 AI 기반 레시피 추천 서비스
- 냉장고 재료 및 개인 선호를 반영한 레시피를 제공하는 서비스입니다.
- **기간:** 2025/2/24 ~ 2025/4/11 (7주)

### 💰 **서비스 특징**

1. **재료 입출고**
   - 사용자는 자유롭게 재료를 입출고할 수 있습니다.
2. **레시피 생성**
   - 냉장고 내 재료 및 개인 선호도 (선호/비선호 재료, 식단, 알러지 정보)를 기반으로 LLM을 활용하여 요리 이름을 생성하고,
     유튜브 내 레시피 영상 리스트를 제공합니다.
3. **단계별 레시피 텍스트**
   - 레시피 영상 내 자막 정보를 추출 및 요약하여 단계별 레시피 텍스트를 제공합니다.
   - 타임스탬프, 자동 스크롤 등의 기능을 통해 간편하게 레시피를 확인할 수 있습니다.
   - 타이머, 요리 재료 정보 등 요리에 도움이 되는 기능들을 제공받을 수 있습니다.
4. **즐겨찾기 및 이전 레시피**
   - 마음에 드는 레시피를 저장하고, 과거에 만든 요리를 다시 찾아볼 수 있습니다.

## 🧰 사용 기술 스택

**Backend** <br> ![Java](https://img.shields.io/badge/java-3670A0?style=for-the-badge&logo=java&logoColor=ffdd54)
![Spring](https://img.shields.io/badge/spring_boot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/spring_data_jpa-6DB33F.svg?style=for-the-badge&logo=springdatajpa&logoColor=white)
![QueryDSL](https://img.shields.io/badge/QueryDSL-0089CF?style=for-the-badge&logo=querydsl&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Elastic Search](https://img.shields.io/badge/elastic-005571?style=for-the-badge&logo=elastic&logoColor=white)
![Webflux](https://img.shields.io/badge/webflux-000000?style=for-the-badge&logo=webflux&logoColor=white)

## 📁 디렉토리 구조 (물리적 기준)
> 아래는 실제 소스코드 디렉토리 기반의 구조입니다.
```text
backend
└── src
    └── main
        ├── java
        │   └── com
        │       └── recipidia
        │           ├── aop
        │           ├── auth
        │           │   ├── config
        │           │   ├── controller
        │           │   ├── dto
        │           │   └── jwt
        │           ├── config
        │           ├── exception
        │           ├── filter
        │           │   ├── controller
        │           │   ├── converter
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── repository
        │           │   └── service
        │           ├── ingredient
        │           │   ├── controller
        │           │   ├── document
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── enums
        │           │   ├── exception
        │           │   ├── handler
        │           │   ├── repository
        │           │   │   └── querydsl
        │           │   ├── request
        │           │   ├── response
        │           │   ├── scheduler
        │           │   └── service
        │           ├── member
        │           │   ├── controller
        │           │   ├── dto
        │           │   ├── entity
        │           │   ├── exception
        │           │   ├── handler
        │           │   ├── repository
        │           │   ├── request
        │           │   ├── response
        │           │   └── service
        │           └── recipe
        │               ├── controller
        │               ├── converter
        │               ├── dto
        │               ├── entity
        │               ├── exception
        │               ├── handler
        │               ├── repository
        │               ├── request
        │               ├── response
        │               └── service
        └── resources
            ├── application.yml
            └── data
```

## 🔐 Jenkins 환경 변수 구성

Jenkins Credential에 다음 값들을 설정합니다.
```
ELASTIC_PASSWORD : Elastic Search의 비밀번호를 설정합니다.
MYSQL_ROOT_PASSWORD : MySQL의 비밀번호를 설정합니다.
HOST_URL : 프론트엔드의 URL을 설정합니다.
FASTAPI_API_URL : FastAPI의 URL을 설정합니다.
X_API : FastAPI와 통신을 위한 헤더로, FASTAPI_SECURITY_KEY와 동일한 값으로 설정합니다.
ADMIN_PW : admin 계정에 사용할 비밀번호를 입력합니다.
```

## 🧠 도메인 책임 요약

| 도메인      | 주요 책임                                                         |
|-------------|------------------------------------------------------------------|
| ingredient  | 사용자 보유 식재료 관리, 재료 기반 검색, Elasticsearch 연동         |
| recipe      | FastAPI 기반 유사 레시피 추천, 냉장고 기반 생성형 레시피 제공       |
| member      | 사용자 CRUD, 즐겨찾기 관리, 정보수정 등                     |
| auth        | JWT 인증 및 토큰 발급, 인증 필터 및 시큐리티 설정                |
| filter      | 사용자 냉장고 재료 기반 조건 필터 제공       |


## 🗂 주요 패키지 구조 및 핵심 클래스 (논리적 책임 기준)
>  각 패키지는 도메인 책임 및 역할을 중심으로 설계되었습니다.

### recipidia.auth
- `AuthController`: 회원가입, 로그인, 토큰 재발급 처리
- `JwtProvider`, `JwtAuthenticationFilter`: JWT 토큰 생성, 검증 및 필터 처리
- `AuthDto`, `LoginRequest`, `TokenResponse`: 인증 요청/응답 객체 정의

### recipidia.ingredient
- `IngredientController`: 식재료 등록/수정/삭제 API 제공
- `IngredientFindController`: 키워드 기반 검색
- `IngredientService`, `IngredientServiceImpl`: 비즈니스 로직 처리 계층
- `IngredientQueryRepository`: QueryDSL 기반 동적 검색 쿼리 작성
- `IngredientDocument`: Elasticsearch 인덱싱용 문서 클래스
- `NutrientUpdateScheduler`: 주기적으로 영양소 정보를 업데이트하는 스케줄러

### recipidia.recipe
- `RecipeController`: 레시피 등록, 조회, 추천 API 제공
- `RecipeService`, `RecipeServiceImpl`: 레시피 생성 및 조건 기반 추천 로직 포함
   - `WebClient`를 통해 **논블로킹 방식**으로 처리
   - 이를 통해 LLM 기반 FastAPI 응답 대기 시간에 대한 병목을 방지
- `RecipeIngredient`: 레시피와 식재료 간 다대다 관계 엔티티

### recipidia.member
- `MemberController`: 사용자 정보 CRUD 처리
- `MemberService`, `MemberServiceImpl`: 사용자 인증 외의 비즈니스 로직 처리
- `Member`: 사용자 도메인 엔티티

### recipidia.filter
- `FilterServiceImpl`: 사용자의 냉장고 재료 기반 필터 알고리즘 처리
- `FilterController`: 냉장고 기반 추천 API 제공
- `FilterEntity`, `FilterRequestDto`: 필터 기준과 결과 매핑

### recipidia.config & aop
- `WebSecurityConfig`: Spring Security 설정 및 JWT 필터 등록
- `GlobalLoggingAspect`: 주요 서비스 메소드 로깅을 위한 AOP 설정

### recipidia.exception & handler
- `GlobalExceptionHandler`: 예외 응답 포맷 일괄 처리
- `IngredientException`, `RecipeNotFoundException`: 도메인별 커스텀 예외 정의