package com.sarvatra.releasenote.service;

import com.sarvatra.releasenote.dto.BeautifyRequest;
import com.sarvatra.releasenote.dto.BeautifyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.model}")
    private String model;

    public BeautifyResponse beautifyText(BeautifyRequest request) {
        try {
            String prompt = buildPrompt(request.getContent(), request.getStyle());

            String fullUrl = apiUrl + "/" + model + ":generateContent?key=" + apiKey;

            Map<String, Object> response = webClient.post()
                    .uri(fullUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "contents", List.of(
                                    Map.of(
                                            "parts", List.of(
                                                    Map.of("text", prompt)
                                            )
                                    )
                            )
                    ))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            if (response != null && response.containsKey("candidates")) {
                @SuppressWarnings("unchecked")
                var candidates = (List<Map<String, Object>>) response.get("candidates");

                if (!candidates.isEmpty()) {
                    var content = (Map<String, Object>) candidates.get(0).get("content");
                    var parts = (List<Map<String, Object>>) content.get("parts");

                    if (!parts.isEmpty()) {
                        String beautifiedText = (String) parts.get(0).get("text");

                        return BeautifyResponse.builder()
                                .originalContent(request.getContent())
                                .beautifiedContent(beautifiedText.trim())
                                .success(true)
                                .build();
                    }
                }
            }

            return BeautifyResponse.builder()
                    .originalContent(request.getContent())
                    .success(false)
                    .error("Unexpected response format from Gemini API")
                    .build();

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return BeautifyResponse.builder()
                    .originalContent(request.getContent())
                    .success(false)
                    .error("Failed to beautify text: " + e.getMessage())
                    .build();
        }
    }

    private String buildPrompt(String content, String style) {

        String styleInstruction = switch (Optional.ofNullable(style).orElse("technical")) {

            case "functional" -> """
                Rewrite the following text by improving clarity, readability, and professionalism, while strictly preserving the original structure.
                
                STRICT REQUIREMENTS:
                - Keep all headings EXACTLY as they are
                - Keep all bullet points EXACTLY as they are
                - Do NOT change ordering or layout
                - Do NOT convert bullets into paragraphs or vice versa
                
                WHAT YOU SHOULD DO:
                - Rephrase sentences to be clearer and more user-friendly
                - Fix grammar and wording
                - Remove unnecessary or redundant words or bullets
                - Simplify overly complex phrasing
                
                
                WHAT YOU MUST NOT DO:
                - Do not remove or alter configuration lines / xml / html /any code (e.g., XML, properties)
                - Do not add new information
                - Do not remove any important information
                - Do not introduce new headings or sections
                - Do not merge or split bullet points
                - Do not change formatting style
                
                OUTPUT:
                - Same structure as input
                - Cleaner, more readable content
                
                INPUT:
                %s
                """.formatted(content);

            case "concise" -> """
                Rewrite the following text into a concise but well-structured professional format.
                
                FORMAT REQUIREMENTS:
                - Keep a structured layout with minimal sections
                - Use short paragraphs or minimal bullet points
                - Maintain proper spacing (no single-line output)
                
                STYLE GUIDELINES:
                - Keep only essential information
                - Remove redundancy
                - Use crisp and clear language
                - Preserve all key technical details
                
                DO NOT:
                - Do not oversimplify to the point of losing meaning
                - Do not merge everything into one line
                - Do not add new information
                
                INPUT:
                %s
                """.formatted(content);

            default -> """
                You are a Technical Professional, Rewrite the following text by improving clarity, readability, and professionalism, while strictly preserving the original structure.
                Keep the reponse in a technical style, ensuring all technical details are retained and clearly presented.
                STRICT REQUIREMENTS:
                - Keep all headings EXACTLY as they are
                - Keep all bullet points EXACTLY as they are
                - Do NOT change ordering or layout
                - Do NOT convert bullets into paragraphs or vice versa
                
                WHAT YOU SHOULD DO:
                - Rephrase sentences to be clearer and more user-friendly
                - Fix grammar and wording
                - Remove unnecessary or redundant words or bullets
                - Simplify overly complex phrasing
                
                WHAT YOU MUST NOT DO:
                - Do not remove or alter configuration lines / xml / html / or any code (e.g., XML, properties) 
                - Do not add new information
                - Do not remove any important information
                - Do not introduce new headings or sections
                - Do not merge or split bullet points
                - Do not change formatting style
                
                OUTPUT:
                - Same structure as input
                - Cleaner, more readable content
                
                INPUT:
                %s
                """.formatted(content); };

        return """
                You are a professional release documentation assistant.
                
                Your task is to rewrite the given input into a clean, structured, and highly readable format.
                
                CRITICAL RULES:
                - Output ONLY the final formatted text
                - Do NOT include explanations or commentary
                - Do NOT generate single-line or compressed output
                - Maintain proper spacing and readability
                - Follow the format strictly
                
                %s
                """.formatted(styleInstruction);
    }
}