package com.sarvatra.releasenote.service;

import com.sarvatra.releasenote.model.ReleaseNote;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.usermodel.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTR;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTRPr;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTShd;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.STShd;

import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@Slf4j
public class WordExportService {

    // Date format for the header - matches the template format "25th March, 2026"
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd'th' MMMM, yyyy");
    // Date format for Document Control table - matches "25/03/2026"
    private static final DateTimeFormatter DATE_TABLE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] exportToWord(ReleaseNote releaseNote) throws IOException, InvalidFormatException {
        // Load the template
        ClassPathResource resource = new ClassPathResource("templates/release-note-template.docx");

        try (InputStream is = resource.getInputStream();
             OPCPackage pkg = OPCPackage.open(is);
             XWPFDocument document = new XWPFDocument(pkg);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // ✅ Replace placeholders in body paragraphs
            replaceInParagraphs(document, releaseNote);

            // ✅ Replace placeholders in body tables
            replaceInTables(document, releaseNote);

            // ✅ NEW: Replace placeholders in headers
            for (XWPFHeader header : document.getHeaderList()) {
                for (XWPFParagraph para : header.getParagraphs()) {
                    replaceInParagraph(para, releaseNote);
                }
                for (XWPFTable table : header.getTables()) {
                    for (XWPFTableRow row : table.getRows()) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            for (XWPFParagraph para : cell.getParagraphs()) {
                                replaceInParagraph(para, releaseNote);
                            }
                        }
                    }
                }
            }

            // ✅ NEW: Replace placeholders in footers (optional but recommended)
            for (XWPFFooter footer : document.getFooterList()) {
                for (XWPFParagraph para : footer.getParagraphs()) {
                    replaceInParagraph(para, releaseNote);
                }
                for (XWPFTable table : footer.getTables()) {
                    for (XWPFTableRow row : table.getRows()) {
                        for (XWPFTableCell cell : row.getTableCells()) {
                            for (XWPFParagraph para : cell.getParagraphs()) {
                                replaceInParagraph(para, releaseNote);
                            }
                        }
                    }
                }
            }

            document.write(out);
            return out.toByteArray();
        }
    }

    private void replaceInParagraphs(XWPFDocument document, ReleaseNote rn) {
        for (XWPFParagraph para : document.getParagraphs()) {
            replaceInParagraph(para, rn);
        }
    }

    private void replaceInParagraph(XWPFParagraph para, ReleaseNote rn) {
        String text = para.getText();
        if (text == null || !text.contains("{{")) return;

        String newText = getReplacementText(text, rn);
        if (!text.equals(newText)) {
            // Clear runs
            while (para.getRuns().size() > 0) {
                para.removeRun(0);
            }

            // Check if content contains HTML tags
            if (newText.contains("<") && newText.contains(">")) {
                // Parse HTML and create formatted runs
                insertHtmlAsRuns(para, newText);
            } else {
                // Normal text without HTML
                String[] lines = newText.split("\\n+");
                XWPFRun run = para.createRun();
                for (int i = 0; i < lines.length; i++) {
                    run.setText(lines[i].trim());
                    if (i < lines.length - 1) {
                        run.addBreak();
                    }
                }
            }
        }
    }

    /**
     * Insert HTML content as formatted runs in a paragraph
     * Improved to handle Quill's HTML format
     */
    private void insertHtmlAsRuns(XWPFParagraph para, String html) {
        final String plainText = html.replaceAll("<[^>]+>", "").trim();

        try {
            // Parse HTML
            org.jsoup.nodes.Document doc = Jsoup.parse(html);
            Element body = doc.body();

            processElement(para, body, true);

        } catch (Exception e) {
            log.error("Error parsing HTML: {}", e.getMessage());
            // Fallback to plain text
            XWPFRun run = para.createRun();
            run.setText(plainText);
        }
    }

    /**
     * Process an element and its children recursively
     */
    private void processElement(XWPFParagraph para, Element element, boolean isFirst) {
        boolean first = isFirst;

        for (Node node : element.childNodes()) {
            if (node instanceof TextNode) {
                TextNode textNode = (TextNode) node;
                String text = textNode.text().trim();
                if (!text.isEmpty()) {
                    XWPFRun run = para.createRun();
                    run.setText(text);
                    if (!first) {
                        run.addBreak();
                    }
                    first = false;
                }
            } else if (node instanceof Element) {
                Element child = (Element) node;
                String tagName = child.tagName().toLowerCase();

                // Handle block elements
                if (tagName.equals("p") || tagName.equals("div")) {
                    // Check if this is a Quill list-item (ql-indent classes)
                    if (child.className().contains("ql-indent") || hasListBullet(child)) {
                        // Treat as list item
                        processListItem(para, child, first);
                    } else {
                        // Process children of p/div - this handles inline formatting like <span class="bold">
                        processElement(para, child, first);
                    }
                    if (!first || para.getRuns().size() > 1) {
                        // Add extra break between paragraphs
                        XWPFRun breakRun = para.createRun();
                        breakRun.addBreak();
                    }
                    first = false;
                }
                // Handle headings (h1, h2, h3 from Quill)
                else if (tagName.matches("h[1-6]")) {
                    processHeading(para, child, first, tagName);
                    first = false;
                }
                // Handle lists
                else if (tagName.equals("ul") || tagName.equals("ol")) {
                    for (Element li : child.select("li")) {
                        processListItem(para, li, first);
                        first = false;
                    }
                }
                // Handle list items directly
                else if (tagName.equals("li")) {
                    processListItem(para, child, first);
                    first = false;
                }
                // Handle span elements - these often have Quill formatting classes
                else if (tagName.equals("span")) {
                    processSpanElement(para, child, first);
                    first = false;
                }
                // Handle inline elements
                else {
                    processInlineElement(para, child, first);
                    first = false;
                }
            }
        }
    }

    /**
     * Check if element has a list bullet (like "- " or "* " at the start)
     */
    private boolean hasListBullet(Element element) {
        String text = element.text().trim();
        return text.startsWith("- ") || text.startsWith("* ") || text.startsWith("• ");
    }

    /**
     * Process a span element with Quill formatting classes
     */
    private void processSpanElement(XWPFParagraph para, Element span, boolean isFirst) {
        String text = span.text().trim();
        if (text.isEmpty()) return;

        XWPFRun run = para.createRun();

        // Check for Quill class-based formatting
        String classAttr = span.className();

        // Bold
        if (classAttr.contains("bold") || classAttr.contains("ql-bold")) {
            run.setBold(true);
        }
        // Italic
        if (classAttr.contains("italic") || classAttr.contains("ql-italic")) {
            run.setItalic(true);
        }
        // Strike
        if (classAttr.contains("strike") || classAttr.contains("ql-strike")) {
            run.setStrikeThrough(true);
        }

        // Handle colors - check style attribute
        String style = span.attr("style");
        if (!style.isEmpty()) {
            // Handle foreground color (text color)
            String color = extractColorFromStyle(style, "color");
            if (color != null) {
                run.setColor(color.toUpperCase());
            }

            // Handle background color (highlight)
            String bgColor = extractColorFromStyle(style, "background-color");
            if (bgColor != null) {
                applyHighlight(run, bgColor);
            }
        }

        // Also check for color in style attribute directly
        String spanStyle = span.attr("style");
        if (!spanStyle.isEmpty()) {
            if (spanStyle.contains("color") || spanStyle.contains("background")) {
                // Color already handled above
            }
        }

        processElement(para, span, isFirst);

        if (!isFirst) {
            run.addBreak();
        }
    }

    /**
     * Process a list item element
     */
    private void processListItem(XWPFParagraph para, Element li, boolean isFirst) {
        // Get all text content including nested elements
        String text = li.text().trim();
        if (text.isEmpty()) return;

        XWPFRun run = para.createRun();
        run.setText("• " + text);

        // Check for bold/italic within the list item
        if (hasBold(li)) {
            run.setBold(true);
        }
        if (hasItalic(li)) {
            run.setItalic(true);
        }

        // Handle foreground color
        String fgColor = extractColor(li);
        if (fgColor != null) {
            run.setColor(fgColor.toUpperCase());
        }

        // Handle background/highlight color
        String bgStyle = li.attr("style");
        String bgColor = extractColorFromStyle(bgStyle, "background-color");
        if (bgColor != null) {
            applyHighlight(run, bgColor);
        }

        if (!isFirst) {
            run.addBreak();
        }
    }

    /**
     * Process an inline element (strong, b, em, i, span, etc.)
     */
    private void processInlineElement(XWPFParagraph para, Element element, boolean isFirst) {
        String text = element.text().trim();
        if (text.isEmpty()) return;

        XWPFRun run = para.createRun();

        String tagName = element.tagName().toLowerCase();

        // Apply formatting based on tag
        if (tagName.equals("strong") || tagName.equals("b")) {
            run.setBold(true);
        }
        if (tagName.equals("em") || tagName.equals("i")) {
            run.setItalic(true);
        }
        if (tagName.equals("s") || tagName.equals("strike") || tagName.equals("del")) {
            run.setStrikeThrough(true);
        }

        // Handle colors - check style attribute
        String style = element.attr("style");
        if (!style.isEmpty()) {
            // Handle color (foreground)
            String color = extractColorFromStyle(style, "color");
            if (color != null) {
                run.setColor(color.toUpperCase());
            }

            // Handle background color (highlight)
            String bgColor = extractColorFromStyle(style, "background-color");
            if (bgColor != null) {
                applyHighlight(run, bgColor);
            }
        }

        // Also check if element has class-based formatting (Quill uses classes like ql-bold, ql-italic)
        String classAttr = element.className();
        if (classAttr.contains("bold") || classAttr.contains("ql-bold")) {
            run.setBold(true);
        }
        if (classAttr.contains("italic") || classAttr.contains("ql-italic")) {
            run.setItalic(true);
        }
        if (classAttr.contains("strike") || classAttr.contains("ql-strike")) {
            run.setStrikeThrough(true);
        }
        // Note: Underline is not commonly used in Quill, but we handle it anyway

        run.setText(text);

        if (!isFirst) {
            run.addBreak();
        }
    }

    /**
     * Process heading elements (h1, h2, h3, etc.) with appropriate font sizes
     */
    private void processHeading(XWPFParagraph para, Element heading, boolean isFirst, String tagName) {
        String text = heading.text().trim();
        if (text.isEmpty()) return;

        // Determine font size based on heading level
        int fontSize;
        switch (tagName) {
            case "h1":
                fontSize = 24; // Largest heading
                break;
            case "h2":
                fontSize = 20;
                break;
            case "h3":
                fontSize = 16;
                break;
            case "h4":
                fontSize = 14;
                break;
            case "h5":
                fontSize = 12;
                break;
            case "h6":
                fontSize = 11;
                break;
            default:
                fontSize = 11;
        }

        XWPFRun run = para.createRun();
        run.setText(text);
        run.setBold(true);
        run.setFontSize(fontSize);

        // Handle color if specified
        String color = extractColor(heading);
        if (color != null) {
            run.setColor(color.toUpperCase());
        }

        if (!isFirst) {
            run.addBreak();
        }
    }

    /**
     * Extract color from element's style attribute
     */
    private String extractColor(Element element) {
        String style = element.attr("style");
        return extractColorFromStyle(style, "color");
    }

    /**
     * Extract color from style string - returns hex color (no conversion)
     */
    private String extractColorFromStyle(String style, String property) {
        if (style == null || style.isEmpty()) return null;

        try {
            // For foreground color, we need to match "color:" but NOT "background-color:"
            // We need to check that "color:" is either at the start or preceded by a semicolon or space
            int idx = -1;

            if (property.equals("color")) {
                // Special handling for "color" - must be standalone property
                // Look for "color:" but not as part of "background-color:"
                int colorIdx = style.indexOf("color:");
                while (colorIdx != -1) {
                    // Check if this is actually "background-color:"
                    boolean isBackground = false;
                    if (colorIdx > 0) {
                        char prev = style.charAt(colorIdx - 1);
                        if (prev == '-' || (colorIdx >= 12 && style.substring(colorIdx - 12, colorIdx).contains("background"))) {
                            isBackground = true;
                        }
                    }
                    if (!isBackground && (colorIdx == 0 || style.charAt(colorIdx - 1) == ';' || style.charAt(colorIdx - 1) == ' ')) {
                        idx = colorIdx;
                        break;
                    }
                    colorIdx = style.indexOf("color:", colorIdx + 1);
                }
            } else {
                // For other properties like "background-color", just do normal search
                idx = style.indexOf(property + ":");
            }

            if (idx == -1) return null;

            int start = idx + property.length() + 1;
            String remainder = style.substring(start).trim();
            // Handle rgb(r, g, b) format
            if (remainder.startsWith("rgb")) {
                int openParen = remainder.indexOf("(");
                int closeParen = remainder.indexOf(")");
                if (openParen != -1 && closeParen != -1) {
                    String rgb = remainder.substring(openParen + 1, closeParen);
                    String[] parts = rgb.split(",");
                    if (parts.length >= 3) {
                        int r = Integer.parseInt(parts[0].trim());
                        int g = Integer.parseInt(parts[1].trim());
                        int b = Integer.parseInt(parts[2].trim());
                        // Return as hex without conversion
                        return String.format("%02x%02x%02x", r, g, b);
                    }
                }
            }
            // Handle hex format (#ffffff)
            String color = remainder.split("[;\\s]")[0].trim();
            if (color.startsWith("#") && color.length() >= 6) {
                return color.substring(1, 7);
            }
        } catch (Exception e) {
            log.debug("Error extracting color: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Apply background highlight using Word's native highlighting feature
     * This is a simplified version - actual Word highlighting requires complex XML manipulation
     */
    private void applyHighlight(XWPFRun run, String bgColorHex) {
        try {
            if (bgColorHex == null) return;

            bgColorHex = bgColorHex.toUpperCase();

            // Get or create run properties
            CTR ctr = run.getCTR();
            CTRPr rPr = ctr.isSetRPr() ? ctr.getRPr() : ctr.addNewRPr();

            // ALWAYS create new shading (safe for all versions)
            CTShd shd = rPr.addNewShd();

            shd.setVal(STShd.CLEAR);
            shd.setColor("auto");
            shd.setFill(bgColorHex);

        } catch (Exception e) {
            log.error("Error applying highlight: {}", e.getMessage());
        }
    }

    /**
     * Check if element or its children have bold formatting
     */
    private boolean hasBold(Element element) {
        String tagName = element.tagName().toLowerCase();
        if (tagName.equals("strong") || tagName.equals("b")) {
            return true;
        }
        if (element.className().contains("bold")) {
            return true;
        }
        // Check children
        for (Element child : element.children()) {
            if (hasBold(child)) return true;
        }
        return false;
    }

    /**
     * Check if element or its children have italic formatting
     */
    private boolean hasItalic(Element element) {
        String tagName = element.tagName().toLowerCase();
        if (tagName.equals("em") || tagName.equals("i")) {
            return true;
        }
        if (element.className().contains("italic")) {
            return true;
        }
        // Check children
        for (Element child : element.children()) {
            if (hasItalic(child)) return true;
        }
        return false;
    }

    /**
     * Convert hex color to POI color format
     */
    private String hexToPOIColor(String hex) {
        // Reverse the hex (POI uses BGR format)
        if (hex.length() == 6) {
            String r = hex.substring(0, 2);
            String g = hex.substring(2, 4);
            String b = hex.substring(4, 6);
            return b + g + r;
        }
        return hex;
    }

    private void replaceInTables(XWPFDocument document, ReleaseNote rn) {
        for (XWPFTable table : document.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph para : cell.getParagraphs()) {
                        replaceInParagraph(para, rn);
                    }
                }
            }
        }
    }

    private String getReplacementText(String text, ReleaseNote rn) {
        Map<String, String> replacements = new TreeMap<>();

        // Version info
        replacements.put("{{version}}", orDefault(rn.getVersion(), ""));
        replacements.put("{{versionWithoutText}}", orDefault(rn.getVersionWithoutText(), ""));
        // Document Control
        // For header date: replace {{releaseDate}}th with full date, then clear other date parts
        String releaseDateStr = formatDate(rn.getReleaseDate());
        replacements.put("{{releaseDate}}", releaseDateStr);
        replacements.put("{{releaseDateTable}}", formatDateForTable(rn.getReleaseDate())); // For table format
        replacements.put("{{author}}", orDefault(rn.getAuthor(), ""));
        replacements.put("{{reviewer}}", orDefault(rn.getReviewer(), ""));

        // Release Details
        replacements.put("{{clientName}}", orDefault(rn.getClientName(), ""));
        replacements.put("{{impactedModule}}", orDefault(rn.getImpactedModule(), ""));
        // releaseContains appears 3 times in template - same value for all
        String releaseContains = orDefault(rn.getReleaseContains(), "");
        replacements.put("{{releaseContains}}", releaseContains);

        // Build Information
        replacements.put("{{mdFiveSum}}", orDefault(rn.getMd5sum(), ""));
        replacements.put("{{gitBranch}}", orDefault(rn.getGitBranch(), ""));
        replacements.put("{{commitId}}", orDefault(rn.getCommitId(), ""));

        // Descriptions
        // functionalDescription appears 1 time in template
        String functionalDesc = orDefault(rn.getFunctionalDescription(), "");
        // If functionalDescription is empty, try to build from functionalItems
        if (functionalDesc.isEmpty() && rn.getFunctionalItems() != null && !rn.getFunctionalItems().isEmpty()) {
            functionalDesc = formatFunctionalItems(rn.getFunctionalItems());
        }
        replacements.put("{{functionalDescription}}", functionalDesc);
        // 1.2 Project Description - Technical
        replacements.put("{{technicalHeadline}}", orDefault(rn.getTechnicalHeadline(), ""));
        replacements.put("{{technicalObjective}}", orDefault(rn.getTechnicalObjective(), ""));
        replacements.put("{{technicalImpactedApi}}", orDefault(rn.getTechnicalImpactedApi(), ""));
        replacements.put("{{technicalConfigParams}}", orDefault(rn.getTechnicalConfigParams(), ""));
        replacements.put("{{technicalConfigChanges}}", orDefault(rn.getTechnicalConfigChanges(), ""));
        replacements.put("{{technicalDBChanges}}", orDefault(rn.getTechnicalDBChanges(), ""));

        // 1.4.1 Network Changes
        replacements.put("{{networkChanges}}", orDefault(rn.getNetworkChanges(), "NA"));

        // 1.4.2 Pre-requisite
        replacements.put("{{prerequisite}}", orDefault(rn.getPrerequisite(), "NA"));

        // 1.5 Prod Release details/snapshot
        replacements.put("{{prodReleaseDetails}}", orDefault(rn.getProdReleaseDetails(), "NA"));

        // 1.6 Implementation Plan
        replacements.put("{{upiSwitchStop}}", orDefault(rn.getUpiSwitchStop(), "./bin/stop"));
        replacements.put("{{upiBigStop}}", orDefault(rn.getUpiBigStop(), "./bin/stop"));
        replacements.put("{{dbScriptDesc}}", orDefault(rn.getDbScriptDesc(), "NA"));
        replacements.put("{{upiBigDesc}}", orDefault(rn.getUpiBigDesc(), "NA"));
        replacements.put("{{upiSwitchDesc}}", orDefault(rn.getUpiSwitchDesc(), "NA"));
        replacements.put("{{upiBigStart}}", orDefault(rn.getUpiBigStart(), "./bin/start"));
        replacements.put("{{upiSwitchStart}}", orDefault(rn.getUpiSwitchStart(), "./bin/start"));
        replacements.put("{{otherServiceDesc}}", orDefault(rn.getOtherServiceDesc(), ""));

        // Rollback
        replacements.put("{{rollbackDb}}", orDefault(rn.getRollbackDb(), "No DB rollback"));
        replacements.put("{{rollbackSwitch}}", orDefault(rn.getRollbackSwitch(), "NA"));

        // Validation
        replacements.put("{{testerName}}", orDefault(rn.getTesterName(), ""));
        replacements.put("{{testValidatorName}}", orDefault(rn.getTestValidatorName(), ""));

        String result = text;
        for (Map.Entry<String, String> entry : replacements.entrySet()) {
            result = result.replace(entry.getKey(), entry.getValue());
        }
        return result;
    }

    private String orDefault(String value, String defaultValue) {
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "";
        try {
            // Returns format like "25th March, 2026"
            return date.format(DATE_FORMATTER);
        } catch (Exception e) {
            return date.toString();
        }
    }

    private String formatDateForTable(LocalDate date) {
        if (date == null) return "";
        try {
            // Returns format like "25/03/2026"
            return date.format(DATE_TABLE_FORMATTER);
        } catch (Exception e) {
            return date.toString();
        }
    }

    private String formatFunctionalItems(List<ReleaseNote.FunctionalItem> items) {
        if (items == null || items.isEmpty()) return "";

        StringBuilder sb = new StringBuilder();
        int i = 1;
        for (ReleaseNote.FunctionalItem item : items) {
            String ticket = orDefault(item.getTicketId(), "");
            String desc = orDefault(item.getDescription(), "");
            String notes = orDefault(item.getAdditionalNotes(), "");

            if (!desc.isEmpty()) {
                sb.append(i).append(". ");
                if (!ticket.isEmpty()) {
                    sb.append(ticket).append(" – ");
                }
                sb.append(desc);
                if (!notes.isEmpty()) {
                    sb.append("\n").append(notes);
                }
                sb.append("\n\n");
            }
            i++;
        }
        return sb.toString().trim();
    }
}
