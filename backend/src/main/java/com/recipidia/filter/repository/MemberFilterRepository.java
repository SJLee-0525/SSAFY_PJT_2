package com.recipidia.filter.repository;

import com.recipidia.filter.entity.MemberFilter;
import com.recipidia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberFilterRepository extends JpaRepository<MemberFilter, Long> {
  Optional<MemberFilter> findByMemberId(Long memberId);
  void deleteByMember(Member member);
}