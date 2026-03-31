package com.sarvatra.releasenote.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReleaseNote {
    
    // Version Information
    private String version;
    private String versionWithoutText;  // Version number only (without "Version - " prefix)
    
    // Document Control
    private LocalDate releaseDate;
    private String author;
    private String reviewer;
    
    // Release Details
    private String clientName;
    private String impactedModule;
    private String releaseContains;
    
    // Build Information
    private String md5sum;
    private String gitBranch;
    private String commitId;
    
    // Descriptions
    private List<FunctionalItem> functionalItems;
    private String functionalDescription;
    
    // 1.2 Project Description - Technical
    private String technicalHeadline;
    private String technicalObjective;
    private String technicalImpactedApi;
    private String technicalConfigParams;
    private String technicalConfigChanges;
    private String technicalDBChanges;
    
    // 1.4.1 Network Changes
    private String networkChanges;
    
    // 1.4.2 Pre-requisite
    private String prerequisite;
    
    // 1.5 Prod Release details/snapshot
    private String prodReleaseDetails;
    
    // 1.6 Implementation Plan
    private String upiSwitchStop;
    private String upiBigStop;
    private String dbScriptDesc;
    private String upiBigDesc;
    private String upiSwitchDesc;
    private String upiBigStart;
    private String upiSwitchStart;
    private String otherServiceDesc;
    
    // Rollback
    private String rollbackDb;
    private String rollbackSwitch;
    
    // Validation
    private String testerName;
    private String testValidatorName;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FunctionalItem {
        private String ticketId;
        private String description;
        private String additionalNotes;
    }
}
