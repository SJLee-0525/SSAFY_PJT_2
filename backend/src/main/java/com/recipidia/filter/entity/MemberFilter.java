package com.recipidia.filter.entity;

import com.recipidia.filter.converter.MemberFilterDataConverter;
import com.recipidia.filter.dto.MemberFilterData;
import com.recipidia.member.entity.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class MemberFilter {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id", nullable = false, unique = true)
  private Member member;

  // 6개 정보를 하나의 JSON 컬럼으로 저장 (TEXT 타입)
  @Lob
  @Column(name = "filter_data", columnDefinition = "TEXT")
  @Convert(converter = MemberFilterDataConverter.class)
  private MemberFilterData filterData;

  @Builder
  public MemberFilter(Member member, MemberFilterData filterData) {
    this.member = member;
    this.filterData = filterData;
  }

  // Filter 정보 갱신 메소드
  public void updateFilterData(MemberFilterData newData) {
    this.filterData = newData;
  }
}
