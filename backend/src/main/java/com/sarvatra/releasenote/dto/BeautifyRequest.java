package com.sarvatra.releasenote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeautifyRequest {
    private String content;
    private String style; // "technical", "functional", "concise"
}
