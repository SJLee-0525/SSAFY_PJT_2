package com.recipidia.member.request;

import java.io.Serializable;

public record BookmarkPatchReq(
    Long memberId,
    Integer rating,
    Boolean favorite
) implements Serializable { }