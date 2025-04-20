package com.recipidia.config;

import com.recipidia.auth.jwt.JwtAuthenticationFilter;
import com.recipidia.auth.jwt.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private final UserDetailsService userDetailsService;

  public SecurityConfig(UserDetailsService userDetailsService) {
    this.userDetailsService = userDetailsService;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // CORS 설정
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        // CSRF 비활성화
        .csrf(csrf -> csrf.disable())
        // 세션을 사용하지 않음 (JWT 기반 인증은 Stateless)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // URL 접근 제어
        .authorizeHttpRequests(auth -> auth
            // 로그인 엔드포인트는 모두 허용
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
            // Swagger 관련 엔드포인트는 모두 허용
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**", "/actuator/health", "/api/actuator/health").permitAll()
            // 임시로 webflux쪽 엔드포인트는 모두 허용
            .requestMatchers("/api/v1/recipe/**").permitAll()
            // 그 외 모든 요청은 인증 필요
            .anyRequest().authenticated()
        )
        // JWT 인증 필터 추가 (UsernamePasswordAuthenticationFilter 이전에 실행)
        .addFilterBefore(new JwtAuthenticationFilter(jwtUtil(), userDetailsService), UsernamePasswordAuthenticationFilter.class)
        // 폼 로그인/로그아웃 비활성화
        .formLogin(form -> form.disable())
        .logout(logout -> logout.disable());

    return http.build();
  }

  @Bean
  public JwtUtil jwtUtil() {
    return new JwtUtil();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://j12s003.p.ssafy.io"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setMaxAge(3600L * 24);
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
