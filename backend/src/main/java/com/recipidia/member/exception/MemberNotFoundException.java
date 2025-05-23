package com.recipidia.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MemberNotFoundException extends RuntimeException {
  public MemberNotFoundException(Long memberId) {
    super("Member not found with id: " + memberId);
  }
}