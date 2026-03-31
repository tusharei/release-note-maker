# Release Note Template - Placeholder Guide

## How to Use This Template

1. Open `release-note-template.docx` in Microsoft Word
2. Replace the sample values with placeholders (shown below)
3. Save the file

---

## All Placeholders to Use

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{companyName}}` | Company Name | Sarvatra Technologies |
| `{{version}}` | Version Number | PPIUPISWK_2.1.1 |
| `{{releaseDate}}` | Release Date | 25th March, 2026 |
| `{{preparedBy}}` | Prepared By | Your Name |
| `{{author}}` | Author Name | Tushar Sharma |
| `{{reviewer}}` | Reviewer Name | Venkatesh Yemul |
| `{{clientName}}` | Client Name | Pinelab PPI |
| `{{impactedModule}}` | Impacted Modules | UPI Switch, BIG |
| `{{releaseContains}}` | What's Included | Switch, BIG, DB |
| `{{switchConfig}}` | Switch Config File | upi-rc.cfg |
| `{{bigConfig}}` | BIG Config File | rc.cfg |
| `{{dbScript}}` | DB Script Name | script.sql |
| `{{md5Sum}}` | MD5 Checksum | NA |
| `{{nag}}` | NAG Alert | NA |
| `{{gitBranch}}` | Git Branch | NA |
| `{{commitId}}` | Commit ID | NA |
| `{{functionalItems}}` | Functional Changes | (see format below) |
| `{{bigRcs}}` | BIG RC Codes | RC.1026=1026,Message... |
| `{{switchRcs}}` | Switch RC Codes | UPI.APP.BIG.rc.1026=1026,... |
| `{{dbScriptTechnical}}` | DB Script | UPDATE upi_entity_config... |
| `{{networkChanges}}` | Network Changes | NA |
| `{{prerequisites}}` | Pre-requisites | Java 11 required |
| `{{preDeploymentTasks}}` | Pre-Deployment | 1. Stop UPI Switch... |
| `{{deploymentTasks}}` | Deployment Steps | 1. Deploy... |
| `{{postDeploymentTasks}}` | Post-Deployment | 1. Monitor... |
| `{{rollbackTasks}}` | Rollback Steps | 1. Stop... |
| `{{qaTestingStatus}}` | QA Status | Pass/Fail |
| `{{qaTesterName}}` | QA Tester | Mahesh Mhetre |
| `{{preProdTestingStatus}}` | PreProd Status | Pass/Fail/NA |
| `{{preProdTesterName}}` | PreProd Tester | Name |

---

## Functional Items Format

Replace `{{functionalItems}}` with:
```
1. PINE-444 – RC Mapping description

2. TICKET-ID – Description
```

---

## Example: How It Should Look

```
Version – {{version}}
Client Name – {{clientName}}
Release Contains – {{releaseContains}}
```

When exported, it will become:
```
Version – PPIUPISWK_2.1.1
Client Name – Pinelab PPI
Release Contains – Switch, BIG
```
