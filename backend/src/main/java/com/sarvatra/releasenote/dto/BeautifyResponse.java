package com.sarvatra.releasenote.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeautifyResponse {
    private String originalContent;
    private String beautifiedContent;
    private boolean success;
    private String error;
}
