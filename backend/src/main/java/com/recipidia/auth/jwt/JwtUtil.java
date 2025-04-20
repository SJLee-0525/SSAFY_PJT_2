package com.recipidia.auth.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

  // HS512에 안전한 키 생성
  private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
  // 토큰 유효기간 (100시간)
  private long jwtExpirationInMs = 360000000;

  // JWT 토큰 생성
  public String generateToken(String username) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(key, SignatureAlgorithm.HS512)
        .compact();
  }

  // JWT 토큰에서 사용자 이름 추출
  public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
  }

  // JWT 토큰 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (Exception ex) {
      // 토큰 만료, 변조 등의 예외 처리
    }
    return false;
  }
}
