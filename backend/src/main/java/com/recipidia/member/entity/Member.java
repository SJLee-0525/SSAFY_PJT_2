package com.recipidia.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String membername;

  // 추가된 부분 (양방향 관계 설정)
  @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<MemberRecipe> memberRecipes = new ArrayList<>();

  @Builder
  public Member(String membername) {
    this.membername = membername;
  }

  public void updateMembername(String newMembername) {
    this.membername = newMembername;
  }
}
