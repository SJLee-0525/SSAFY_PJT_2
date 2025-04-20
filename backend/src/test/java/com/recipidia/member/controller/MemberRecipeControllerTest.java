package com.recipidia.member.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.recipidia.member.dto.RecipeWithMemberInfoDto;
import com.recipidia.member.service.MemberRecipeService;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MemberRecipeController.class)
@AutoConfigureMockMvc
class MemberRecipeControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private MemberRecipeService memberRecipeService;

  @TestConfiguration
  static class TestSecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      return http
          .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
          .authorizeHttpRequests(auth -> auth
              .anyRequest().permitAll() // 모든 요청 허용 (테스트 용도)
          )
          .build();
    }
  }

  @TestConfiguration
  static class TestConfig {
    @Bean
    public MemberRecipeService memberRecipeService() {
      return mock(MemberRecipeService.class); // Mockito mock 사용
    }
  }

  @Test
  void getMemberFavorites_ReturnsPagedDtoList_WhenRequestIsValid() throws Exception {
    // given
    Long memberId = 1L;
    int size = 5;
    int total = 10;

    List<RecipeWithMemberInfoDto> memberRecipeList = IntStream.range(0, 5)
        .mapToObj(i -> new RecipeWithMemberInfoDto(
            (long) i,
            "김치볶음밥",
            "맛있는 김치볶음밥 레시피",
            "https://youtube.com/kimchi",
            "요리왕",
            "PT5M30S",
            1000L * i,
            150L * i,
            true,
            true,
            5 + i
        ))
        .toList();

    Pageable searchParam = PageRequest.of(0, size);
    Page<RecipeWithMemberInfoDto> page = new PageImpl<>(memberRecipeList, searchParam, total);

    when(memberRecipeService.getMemberFavorites(memberId, searchParam)).thenReturn(page);

    // when & then
    mockMvc.perform(get("/api/v1/member/recipe/1/favorites"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(size)))
        .andExpect(jsonPath("$.totalElements").value(total))
        .andExpect(jsonPath("$.content[0].name").value("김치볶음밥"));
  }
  @Test
  void getMemberRatedRecipes_ReturnsPagedDtoList_WhenRequestIsValid() throws Exception {
    // given
    Long memberId = 1L;
    int size = 5;
    int total = 10;

    List<RecipeWithMemberInfoDto> ratedRecipeList = IntStream.range(0, size)
        .mapToObj(i -> new RecipeWithMemberInfoDto(
            (long) i,
            "제육볶음",
            "맛있는 제육볶음 레시피",
            "https://youtube.com/jeyuk",
            "한식의정석",
            "PT7M10S",
            800L * i,
            100L * i,
            true,
            true,
            3 + i // rating 값 다름
        ))
        .toList();

    Pageable searchParam = PageRequest.of(0, size);
    Page<RecipeWithMemberInfoDto> page = new PageImpl<>(ratedRecipeList, searchParam, total);

    when(memberRecipeService.getMemberRatedRecipes(memberId, searchParam)).thenReturn(page);

    // when & then
    mockMvc.perform(get("/api/v1/member/recipe/1/ratings"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(size)))
        .andExpect(jsonPath("$.totalElements").value(total))
        .andExpect(jsonPath("$.content[1].name").value("제육볶음"))
        .andExpect(jsonPath("$.content[1].rating").value(4));
  }
}