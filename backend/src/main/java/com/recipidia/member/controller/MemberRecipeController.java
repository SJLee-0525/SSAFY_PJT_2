package com.recipidia.member.controller;

import com.recipidia.member.dto.MemberRecipeDto;
import com.recipidia.member.dto.RecipeWithMemberInfoDto;
import com.recipidia.member.request.BookmarkPatchReq;
import com.recipidia.member.service.MemberRecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/member/recipe")
@RequiredArgsConstructor
public class MemberRecipeController {

  private final MemberRecipeService memberRecipeService;

  @Operation(
      summary = "사용자 레시피 즐겨찾기/별점 정보 수정",
      description = "회원이 특정 레시피에 대해 즐겨찾기(favorite) 또는 별점(rating)을 선택적으로 업데이트합니다.",
      requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
          description = "수정할 회원‑레시피 정보",
          required = true,
          content = @Content(
              mediaType = "application/json",
              schema = @Schema(implementation = BookmarkPatchReq.class),
              examples = @ExampleObject(value = """
                      {
                        "memberId": 2,
                        "rating": 4,
                        "favorite": true
                      }
                  """)
          )
      ),
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "회원‑레시피 정보 수정 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberRecipeDto.class),
                  examples = @ExampleObject(value = """
                          {
                            "memberId": 2,
                            "recipeId": 12,
                            "rating": 4,
                            "favorite": true,
                            "createdAt": "2025-03-24T10:15:30"
                          }
                      """)
              )
          ),
          @ApiResponse(
              responseCode = "404",
              description = "회원 또는 레시피를 찾을 수 없음",
              content = @Content(
                  mediaType = "application/json",
                  examples = @ExampleObject(value = "{\"message\": \"Member not found with id: 2\"}")
              )
          )
      }
  )
  @PatchMapping("/{recipeId}")
  public ResponseEntity<MemberRecipeDto> patchMemberRecipe(
      @PathVariable Long recipeId,
      @RequestBody BookmarkPatchReq req
  ) {
    MemberRecipeDto result = memberRecipeService.patchMemberRecipe(req.memberId(), recipeId,
        req.rating(), req.favorite());
    return ResponseEntity.ok(result);
  }

  @Operation(
      summary = "사용자의 즐겨찾기/별점 레시피 목록 조회",
      description = "특정 사용자가 평가하거나 즐겨찾기한 모든 레시피 목록을 조회합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "사용자 레시피 목록 조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = MemberRecipeDto[].class)
              )
          ),
          @ApiResponse(
              responseCode = "404",
              description = "사용자를 찾을 수 없음",
              content = @Content(
                  mediaType = "application/json",
                  examples = @ExampleObject(value = "{\"message\": \"Member not found with id: 10\"}")
              )
          )
      }
  )
  @GetMapping("/{memberId}")
  public ResponseEntity<List<MemberRecipeDto>> getMemberRecipes(@PathVariable Long memberId) {
    List<MemberRecipeDto> memberRecipes = memberRecipeService.getMemberRecipes(memberId);
    return ResponseEntity.ok(memberRecipes);
  }

  @Operation(
      summary = "사용자가 즐겨찾기한 레시피 목록 조회",
      description = "특정 사용자가 favorite=true 로 표시한 모든 레시피를 반환합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = RecipeWithMemberInfoDto[].class)
              )
          )
      }
  )
  @GetMapping("/{memberId}/favorites")
  public ResponseEntity<Page<RecipeWithMemberInfoDto>> getMemberFavorites(
      @PathVariable Long memberId,
      @PageableDefault(size = 5) Pageable pageable) {
    return ResponseEntity.ok(memberRecipeService.getMemberFavorites(memberId, pageable));
  }

  @Operation(
      summary = "사용자가 별점을 준 레시피 목록 조회",
      description = "특정 사용자가 rating 값을 부여한 모든 레시피를 반환합니다.",
      responses = {
          @ApiResponse(
              responseCode = "200",
              description = "조회 성공",
              content = @Content(
                  mediaType = "application/json",
                  schema = @Schema(implementation = RecipeWithMemberInfoDto[].class)
              )
          )
      }
  )
  @GetMapping("/{memberId}/ratings")
  public ResponseEntity<Page<RecipeWithMemberInfoDto>> getMemberRatedRecipes(
      @PathVariable Long memberId,
      @PageableDefault(size = 5) Pageable pageable) {
    return ResponseEntity.ok(memberRecipeService.getMemberRatedRecipes(memberId, pageable));
  }

}
