package com.recipidia.aop;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class ControllerLoggingAspect {

  private static final Logger logger = LoggerFactory.getLogger(ControllerLoggingAspect.class);

  @Around("execution(* com.recipidia..controller..*(..))")
  public Object logAroundControllerMethod(ProceedingJoinPoint joinPoint) throws Throwable {

    long start = System.currentTimeMillis();

    // 기본 메타 정보 추출
    String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
    String methodName = joinPoint.getSignature().getName();

    ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (attributes != null) {
      HttpServletRequest request = attributes.getRequest();
      String httpMethod = request.getMethod();
      String uri = request.getRequestURI();
      String params = getRequestParams(request);

      logger.info(">> 요청 시작: [{}] {}.{}() | URI: {} | Params: {}", httpMethod, className, methodName, uri, params);
    } else {
      logger.info(">> 요청 시작: {}.{}()", className, methodName);
    }

    // 실제 컨트롤러 실행
    Object result = joinPoint.proceed();

    long end = System.currentTimeMillis();
    long elapsed = end - start;

    logger.info("<< 요청 종료: {}.{}() - 처리시간: {}ms", className, methodName, elapsed);

    return result;
  }

  // 요청 파라미터를 문자열로 변환
  private String getRequestParams(HttpServletRequest request) {
    Enumeration<String> paramNames = request.getParameterNames();
    StringBuilder params = new StringBuilder();

    while (paramNames.hasMoreElements()) {
      String name = paramNames.nextElement();
      String value = request.getParameter(name);
      params.append(name).append("=").append(value).append("&");
    }

    if (!params.isEmpty()) {
      params.setLength(params.length() - 1);  // 마지막 & 제거
    }

    return params.toString();
  }
}
