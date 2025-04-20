package com.recipidia.member.repository;

import com.recipidia.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
  List<Member> findAllByOrderByIdAsc();
}
