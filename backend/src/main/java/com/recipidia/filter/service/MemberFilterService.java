package com.recipidia.filter.service;

import com.recipidia.filter.dto.MemberFilterDto;
import com.recipidia.filter.dto.MemberFilterData;

public interface MemberFilterService {
  // 특정 회원의 필터 정보를 조회합니다.
  MemberFilterDto getMemberFilter(Long memberId);

  // 특정 회원의 필터 정보를 업데이트합니다.
  MemberFilterDto updateMemberFilter(Long memberId, MemberFilterData filterData);
}