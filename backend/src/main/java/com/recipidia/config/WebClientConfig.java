package com.recipidia.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${fastapi.base.url}")
    private String fastApiBaseUrl;

    @Value("${fastapi.header.xapi}")
    private String fastApiXapi;

    @Bean
    public WebClient fastApiWebClient(WebClient.Builder builder) {
        return builder
            .baseUrl(fastApiBaseUrl)
            .defaultHeader("x-api-key", fastApiXapi)
            .build();
    }
}

