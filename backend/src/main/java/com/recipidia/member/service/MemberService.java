package com.recipidia.member.service;

import com.recipidia.member.dto.MemberDto;

import java.util.List;

public interface MemberService {
  MemberDto createMember(String membername);
  MemberDto updateMembername(Long memberId, String newMembername);
  void deleteMember(Long memberId);
  List<MemberDto> getAllMembers();
}