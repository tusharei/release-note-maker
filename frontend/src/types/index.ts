export interface ReleaseNote {
  // Version Information
  version: string;
  versionWithoutText: string;  // Version number only (without "Version - " prefix)
  
  // Document Control
  releaseDate: string;
  author: string;
  reviewer: string;
  
  // Release Details
  clientName: string;
  impactedModule: string;
  releaseContains: string;
  
  // Build Information
  md5sum: string;
  gitBranch: string;
  commitId: string;
  
  // Descriptions
  functionalDescription: string;
  
  // 1.2 Project Description - Technical
  technicalHeadline: string;
  technicalObjective: string;
  technicalImpactedApi: string;
  technicalConfigParams: string;
  technicalConfigChanges: string;
  technicalDBChanges: string;
  
  // 1.4.1 Network Changes
  networkChanges: string;
  
  // 1.4.2 Pre-requisite
  prerequisite: string;
  
  // 1.5 Prod Release details/snapshot
  prodReleaseDetails: string;
  
  // 1.6 Implementation Plan
  upiSwitchStop: string;
  upiBigStop: string;
  dbScriptDesc: string;
  upiBigDesc: string;
  upiSwitchDesc: string;
  upiBigStart: string;
  upiSwitchStart: string;
  otherServiceDesc: string;
  
  // Rollback
  rollbackDb: string;
  rollbackSwitch: string;
  
  // Validation
  testerName: string;
  testValidatorName: string;
}

export interface BeautifyRequest {
  content: string;
  style: 'technical' | 'functional' | 'concise';
}

export interface BeautifyResponse {
  originalContent: string;
  beautifiedContent: string;
  success: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
