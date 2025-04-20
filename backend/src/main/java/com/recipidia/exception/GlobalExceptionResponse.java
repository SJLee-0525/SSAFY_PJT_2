package com.recipidia.exception;

import lombok.Builder;

@Builder
public record GlobalExceptionResponse(int httpstatus, String errorMsg) {

}
