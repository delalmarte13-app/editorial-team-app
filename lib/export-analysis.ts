import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";
import { Platform } from "react-native";

export interface ExportData {
  text: string;
  analyses: {
    [key: string]: string;
  };
  timestamp: number;
  metadata: {
    wordCount: number;
    charCount: number;
    exportedAt: string;
  };
}

export async function exportAsJSON(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-analysis-${Date.now()}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const jsonContent = JSON.stringify(data, null, 2);
    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Compartir análisis editorial",
      });
    }

    return true;
  } catch (error) {
    console.error("Error exporting JSON:", error);
    return false;
  }
}

export async function exportAsCSV(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-analysis-${Date.now()}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    let csvContent = "Especialista,Análisis\n";

    for (const [specialist, analysis] of Object.entries(data.analyses)) {
      const escapedAnalysis = `"${analysis.replace(/"/g, '""')}"`;
      csvContent += `${specialist},${escapedAnalysis}\n`;
    }

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/csv",
        dialogTitle: "Compartir análisis como CSV",
      });
    }

    return true;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return false;
  }
}

export async function exportAsText(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-analysis-${Date.now()}.txt`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    let textContent = "=== ANÁLISIS EDITORIAL COMPLETO ===\n\n";
    textContent += `Fecha: ${new Date(data.timestamp).toLocaleString()}\n`;
    textContent += `Palabras: ${data.metadata.wordCount}\n`;
    textContent += `Caracteres: ${data.metadata.charCount}\n\n`;

    textContent += "--- TEXTO ORIGINAL ---\n";
    textContent += data.text + "\n\n";

    for (const [specialist, analysis] of Object.entries(data.analyses)) {
      textContent += `\n--- ${specialist.toUpperCase()} ---\n`;
      textContent += analysis + "\n";
    }

    await FileSystem.writeAsStringAsync(filePath, textContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: "text/plain",
        dialogTitle: "Compartir análisis como texto",
      });
    }

    return true;
  } catch (error) {
    console.error("Error exporting text:", error);
    return false;
  }
}

export function generateHTMLReport(data: ExportData): string {
  const timestamp = new Date(data.timestamp).toLocaleString();

  let html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Análisis Editorial</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f1e8;
      color: #1a1a1a;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: #d4af37;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
    }
    .metadata {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
      font-size: 14px;
    }
    .metadata-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 10px;
      border-radius: 5px;
    }
    .section {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      border-left: 4px solid #d4af37;
    }
    .section h2 {
      color: #1a1a1a;
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 20px;
    }
    .section p {
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
    .original-text {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      max-height: 300px;
      overflow-y: auto;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📚 Análisis Editorial Completo</h1>
    <div class="metadata">
      <div class="metadata-item">
        <strong>Fecha:</strong> ${timestamp}
      </div>
      <div class="metadata-item">
        <strong>Palabras:</strong> ${data.metadata.wordCount}
      </div>
      <div class="metadata-item">
        <strong>Caracteres:</strong> ${data.metadata.charCount}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Texto Original</h2>
    <div class="original-text">${escapeHtml(data.text)}</div>
  </div>
`;

  for (const [specialist, analysis] of Object.entries(data.analyses)) {
    const specialistName = getSpecialistName(specialist);
    html += `
  <div class="section">
    <h2>${specialistName}</h2>
    <p>${escapeHtml(analysis)}</p>
  </div>
`;
  }

  html += `
  <div class="footer">
    <p>Generado por Editorial Team • ${timestamp}</p>
  </div>
</body>
</html>
  `;

  return html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getSpecialistName(id: string): string {
  const names: { [key: string]: string } = {
    corrector: "✍️ Correctora - Elena Voss",
    analyst: "🔍 Analista - Marco Reyes",
    editor: "📝 Editora - Sophia Laurent",
    translator: "🌐 Traductor - Hiroshi Tanaka",
    kdp: "📚 Especialista KDP - Rachel Stone",
    marketing: "📊 Marketing - Diego Vargas",
    illustrator: "🎨 Ilustradora - Amara Osei",
    economist: "💰 Economista - Carlos Mendez",
    rewriter: "🔄 Reescritura",
    antiAi: "🛡️ Anti-IA",
  };
  return names[id] || id;
}

export async function exportAsDocx(data: ExportData): Promise<boolean> {
  try {
    const fileName = `editorial-analysis-${Date.now()}.docx`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const date = new Date(data.timestamp);
    const dateStr = date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const sections = [
      new Paragraph({
        text: "ANÁLISIS EDITORIAL COMPLETO",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: "Tu Equipo Editorial Virtual",
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: dateStr,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      }),
      new Paragraph({
        text: "TEXTO ORIGINAL",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
      new Paragraph({
        text: data.text,
        spacing: { after: 400 },
        alignment: AlignmentType.JUSTIFIED,
      }),
      new Paragraph({
        text: "ANÁLISIS DETALLADO POR DEPARTAMENTO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 300 },
      }),
    ];

    for (const [specialist, analysis] of Object.entries(data.analyses)) {
      if (analysis && typeof analysis === "string" && analysis.trim()) {
        const specialistName = getSpecialistName(specialist);
        sections.push(
          new Paragraph({
            text: specialistName,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: analysis,
            spacing: { after: 300 },
            alignment: AlignmentType.JUSTIFIED,
          })
        );
      }
    }

    sections.push(
      new Paragraph({
        text: "Documento generado por Editorial Team - Tu equipo editorial de élite",
        spacing: { before: 600 },
        alignment: AlignmentType.CENTER,
        run: {
          italics: true,
        },
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: sections,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    
    if (Platform.OS === "web") {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `editorial-analysis-${Date.now()}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      const base64 = await blobToBase64(blob);
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          dialogTitle: "Compartir análisis editorial",
        });
      }
      return true;
    }
  } catch (error) {
    console.error("Error exporting DOCX:", error);
    return false;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] || result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
