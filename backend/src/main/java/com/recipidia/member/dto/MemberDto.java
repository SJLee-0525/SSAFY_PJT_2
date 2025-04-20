package com.recipidia.member.dto;

import com.recipidia.member.entity.Member;

import java.io.Serializable;

/**
 * DTO for {@link Member}
 */
public record MemberDto(Long memberId, String membername) implements Serializable {

  public static MemberDto fromEntity(Member member) {
    return new MemberDto(
        member.getId(),
        member.getMembername()
    );
  }
}
