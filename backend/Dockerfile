# 빌드단계
FROM openjdk:17-jdk-alpine3.13 AS build
COPY . .
RUN chmod +x gradlew
RUN ./gradlew clean build -x test

# 실행단계
FROM openjdk:17-jdk-alpine3.13
COPY --from=build /build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar","/app.jar"]