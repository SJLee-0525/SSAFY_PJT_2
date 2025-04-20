package com.recipidia.auth.controller;

import com.recipidia.auth.dto.LoginRequest;
import com.recipidia.auth.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthenticationManager authenticationManager;
  private final JwtUtil jwtUtil;

  public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
    // 사용자 이름과 비밀번호로 인증 토큰 생성
    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password());

    // 인증 시도
    Authentication authentication = authenticationManager.authenticate(authToken);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // JWT 토큰 생성 후 반환
    String token = jwtUtil.generateToken(loginRequest.username());
    return ResponseEntity.ok(token);
  }
}
