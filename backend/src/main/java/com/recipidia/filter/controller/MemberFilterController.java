package com.recipidia.filter.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipidia.filter.dto.MemberFilterData;
import com.recipidia.filter.dto.MemberFilterDto;
import com.recipidia.filter.service.MemberFilterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/filter")
@RequiredArgsConstructor
public class MemberFilterController {

  private final ObjectMapper objectMapper;
  private final MemberFilterService memberFilterService;

  @Operation(
      summary = "회원 필터 정보 조회",
      description = "특정 회원의 선호/비선호 정보를 조회합니다.",
      responses = {
          @ApiResponse(responseCode = "200", description = "회원 필터 정보 조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberFilterDto.class)
              )
          ),
          @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
      }
  )
  @GetMapping("/{memberId}")
  public ResponseEntity<MemberFilterDto> getMemberFilter(@PathVariable Long memberId) {
    MemberFilterDto dto = memberFilterService.getMemberFilter(memberId);
    return ResponseEntity.ok(dto);
  }

  @Operation(
      summary = "회원 필터 정보 업데이트",
      description = "회원이 선택한 선호/비선호 정보를 JSON 형태로 받아 업데이트합니다.",
      requestBody = @RequestBody(
          description = "회원 필터 정보 (예: 선호/비선호하는 장르, 식습관, 재료 정보)",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = MemberFilterData.class),
              examples = @ExampleObject(value = """
                {
                  "categories": ["한식", "일식"],
                  "dietaries": ["저당식"],
                  "preferredIngredients": ["토마토", "바질"],
                  "dislikedIngredients": ["마늘"],
                  "allergies" : ["유제품"]
                }
                """)
          )
      ),
      responses = {
          @ApiResponse(responseCode = "200", description = "회원 필터 정보 업데이트 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberFilterDto.class)
              )
          ),
          @ApiResponse(responseCode = "404", description = "회원 정보를 찾을 수 없음")
      }
  )
  @PutMapping("/{memberId}")
  public ResponseEntity<MemberFilterDto> updateMemberFilter(@PathVariable Long memberId,
                                                            HttpServletRequest request) throws IOException {

    String json = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));

    // jackson과 섞어씀으로 인한 문제로 objectMapper로 직접 읽어주기
    MemberFilterData filterData = objectMapper.readValue(json, MemberFilterData.class);

    MemberFilterDto dto = memberFilterService.updateMemberFilter(memberId, filterData);
    return ResponseEntity.ok(dto);
  }
}
