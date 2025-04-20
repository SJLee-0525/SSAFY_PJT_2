package com.recipidia.member.controller;

import com.recipidia.member.dto.MemberDto;
import com.recipidia.member.request.CreateMemberReq;
import com.recipidia.member.request.UpdateMembernameReq;
import com.recipidia.member.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

  private final MemberService memberService;

  // 사용자 등록: membername을 받아 새로운 Member 생성
  @Operation(
      summary = "사용자 등록",
      description = "새로운 사용자를 등록합니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "사용자 등록 요청 정보",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = CreateMemberReq.class)
          )
      ),
      responses = {
          @ApiResponse(
              responseCode = "201",
              description = "사용자 등록 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberDto.class)
              )
          )
      }
  )
  @PostMapping
  public ResponseEntity<MemberDto> createMember(@RequestBody CreateMemberReq request) {
    MemberDto memberDto = memberService.createMember(request.membername());
    return ResponseEntity.status(HttpStatus.CREATED).body(memberDto);
  }

  // 사용자 이름 수정: memberId 경로 변수와 새 이름을 받아서 업데이트
  @Operation(
      summary = "사용자 이름 수정",
      description = "사용자의 이름을 업데이트합니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "변경할 사용자 이름 정보",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = UpdateMembernameReq.class)
          )
      ),
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "사용자 이름 수정 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberDto.class)
              )
          )
      }
  )
  @PutMapping("/{memberId}")
  public ResponseEntity<MemberDto> updateMembername(@PathVariable Long memberId,
                                                  @RequestBody UpdateMembernameReq request) {
    MemberDto memberDto = memberService.updateMembername(memberId, request.newMembername());
    return ResponseEntity.ok(memberDto);
  }

  // 사용자 삭제: memberId를 받아서 삭제
  @Operation(
      summary = "사용자 삭제",
      description = "지정한 사용자를 삭제합니다.",
      responses = {
          @ApiResponse(
              responseCode = "204",
              description = "사용자 삭제 성공"
          )
      }
  )
  @DeleteMapping("/{memberId}")
  public ResponseEntity<String> deleteMember(@PathVariable Long memberId) {
    try {
      memberService.deleteMember(memberId);
      return ResponseEntity.noContent().build();
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
  }

  // 유저 목록 조회: 전체 사용자 목록을 반환
  @Operation(
      summary = "전체 사용자 조회",
      description = "모든 사용자의 목록을 조회합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "전체 사용자 조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberDto[].class)
              )
          )
      }
  )
  @GetMapping
  public ResponseEntity<List<MemberDto>> getAllMembers() {
    List<MemberDto> members = memberService.getAllMembers();
    return ResponseEntity.ok(members);
  }
}
