package com.sarvatra.releasenote.controller;

import com.sarvatra.releasenote.dto.ApiResponse;

import java.util.Map;
import com.sarvatra.releasenote.dto.BeautifyRequest;
import com.sarvatra.releasenote.dto.BeautifyResponse;
import com.sarvatra.releasenote.model.ReleaseNote;
import com.sarvatra.releasenote.service.GeminiService;
import com.sarvatra.releasenote.service.WordExportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173","https://release-note-maker.netlify.app"})
public class ReleaseNoteController {
    
    private final GeminiService geminiService;
    private final WordExportService wordExportService;
    
    @PostMapping("/beautify")
    public ApiResponse<BeautifyResponse> beautifyText(@RequestBody BeautifyRequest request) {
        log.info("Beautifying text with style: {}", request.getStyle());
        BeautifyResponse response = geminiService.beautifyText(request);
        if (response.isSuccess()) {
            return ApiResponse.success("Text beautified successfully", response);
        } else {
            return ApiResponse.error(response.getError());
        }
    }
    
    @PostMapping("/export/word")
    public ResponseEntity<ByteArrayResource> exportToWord(@RequestBody ReleaseNote releaseNote) {
        try {
            log.info("Exporting release note to Word: {}", releaseNote.getVersion());
            
            // Set release date if not set
            if (releaseNote.getReleaseDate() == null) {
                releaseNote.setReleaseDate(LocalDate.now());
            }
            
            byte[] documentBytes = wordExportService.exportToWord(releaseNote);
            ByteArrayResource resource = new ByteArrayResource(documentBytes);
            
            String filename = "ReleaseNote_" + 
                    (releaseNote.getVersion() != null ? releaseNote.getVersion() : "Draft") + 
                    "_" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + 
                    ".docx";
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                    .contentLength(documentBytes.length)
                    .body(resource);
                    
        } catch (IOException | InvalidFormatException e) {
            log.error("Error exporting to Word", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "Service is healthy");
        response.put("data", "OK");
        return response;
    }
    
    @GetMapping("/template")
    public Map<String, Object> getTemplate() {
        ReleaseNote template = new ReleaseNote();
        template.setReleaseDate(LocalDate.now());
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "Template retrieved");
        response.put("data", template);
        return response;
    }
}
