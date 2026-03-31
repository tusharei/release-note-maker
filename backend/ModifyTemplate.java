import java.io.*;
import java.nio.file.*;
import java.util.*;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xwpf.usermodel.*;

public class ModifyTemplate {
    public static void main(String[] args) throws Exception {
        String templatePath = "src/main/resources/templates/release-note-template.docx";
        
        // Read the docx
        try (XWPFDocument doc = new XWPFDocument(OPCPackage.open(templatePath))) {
            
            // Replace specific text patterns with placeholders
            replaceText(doc, "PPIUPISWK_2.1.1", "{{versionWithoutText}}");
            replaceText(doc, "25th March, 2026", "{{releaseDate}}");
            replaceText(doc, "Pinelabs", "{{clientName}}");
            replaceText(doc, "UPI Switch", "{{impactedModule}}");
            replaceText(doc, "Switch, BIG, DB Scripts", "{{releaseContains}}");
            replaceText(doc, "NA", "{{md5sum}}");
            replaceText(doc, "release/ppi-upiswk-2.1.1", "{{gitBranch}}");
            replaceText(doc, "abc123def456", "{{commitId}}");
            replaceText(doc, "John Doe", "{{author}}");
            replaceText(doc, "Jane Smith", "{{reviewer}}");
            replaceText(doc, "Rajesh Kumar", "{{testerName}}");
            replaceText(doc, "Priya Sharma", "{{testValidatorName}}");
            
            // Replace functional description section
            replaceText(doc, "Following fixes / changes are part of the release :", "{{functionalDescription}}");
            
            // Replace technical description section
            replaceText(doc, "following are the RCs to be mapped at Switch and BIG level (if not present in prod env already).", "{{technicalDescription}}");
            
            // Save the modified template
            try (FileOutputStream out = new FileOutputStream(templatePath)) {
                doc.write(out);
            }
            
            System.out.println("Template modified successfully!");
        }
    }
    
    private static void replaceText(XWPFDocument doc, String oldText, String newText) {
        // Replace in paragraphs
        for (XWPFParagraph para : doc.getParagraphs()) {
            if (para.getText().contains(oldText)) {
                for (XWPFRun run : para.getRuns()) {
                    String text = run.getText(0);
                    if (text != null && text.contains(oldText)) {
                        text = text.replace(oldText, newText);
                        run.setText(text, 0);
                    }
                }
            }
        }
        
        // Replace in tables
        for (XWPFTable table : doc.getTables()) {
            for (XWPFTableRow row : table.getRows()) {
                for (XWPFTableCell cell : row.getTableCells()) {
                    for (XWPFParagraph para : cell.getParagraphs()) {
                        for (XWPFRun run : para.getRuns()) {
                            String text = run.getText(0);
                            if (text != null && text.contains(oldText)) {
                                text = text.replace(oldText, newText);
                                run.setText(text, 0);
                            }
                        }
                    }
                }
            }
        }
    }
}
