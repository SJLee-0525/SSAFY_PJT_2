package com.recipidia.filter.service.impl;

import com.recipidia.filter.dto.MemberFilterData;
import com.recipidia.filter.dto.MemberFilterDto;
import com.recipidia.filter.entity.MemberFilter;
import com.recipidia.filter.repository.MemberFilterRepository;
import com.recipidia.filter.service.MemberFilterService;
import com.recipidia.member.entity.Member;
import com.recipidia.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberFilterServiceImpl implements MemberFilterService {

  private final MemberFilterRepository memberFilterRepository;
  private final MemberRepository memberRepository;

  @Override
  @Transactional(readOnly = true)
  public MemberFilterDto getMemberFilter(Long memberId) {
    MemberFilter filter = memberFilterRepository.findByMemberId(memberId)
        .orElseThrow(() -> new RuntimeException("Member filter not found for member id: " + memberId));
    return MemberFilterDto.fromEntity(filter);
  }

  @Override
  public MemberFilterDto updateMemberFilter(Long memberId, MemberFilterData newFilterData) {
    // 회원 엔티티 조회
    Member member = memberRepository.findById(memberId)
        .orElseThrow(() -> new RuntimeException("Member not found for id: " + memberId));

    // 해당 회원의 필터 정보 조회 (이미 존재하면 업데이트, 없으면 생성)
    MemberFilter filter = memberFilterRepository.findByMemberId(memberId)
        .orElseGet(() -> MemberFilter.builder()
            .member(member)
            .filterData(MemberFilterData.builder()  // 초기 기본값(빈 리스트) 할당
                .categories(List.of())
                .dietaries(List.of())
                .preferredIngredients(List.of())
                .dislikedIngredients(List.of())
                .allergies(List.of())
                .build())
            .build());

    // 엔티티의 필드 업데이트 – 기존 데이터를 newFilterData와 비교해서 변경 사항이 있으면 교체
    filter.updateFilterData(newFilterData);

    // 변경 사항 강제 반영 (필요 시 flush 호출)
    memberFilterRepository.save(filter);
    return MemberFilterDto.fromEntity(filter);
  }
}