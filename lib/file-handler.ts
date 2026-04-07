import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";

export interface FileImportResult {
  success: boolean;
  content?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
}

const SUPPORTED_TYPES = {
  "text/plain": [".txt"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function pickAndReadFile(): Promise<FileImportResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, error: "Carga cancelada" };
    }

    if (!result.assets[0]) {
      return { success: false, error: "No se seleccionó archivo" };
    }

    const file = result.assets[0];
    const fileName = file.name || "documento";

    // Validar tipo de archivo
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const mimeType = file.mimeType || "";

    if (!isValidFileType(fileExtension || "", mimeType)) {
      return {
        success: false,
        error: `Tipo de archivo no soportado. Usa: .txt, .pdf, .doc, .docx`,
      };
    }

    // Validar tamaño
    if (file.size && file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `Archivo muy grande. Máximo 5MB. Tu archivo: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    // Leer contenido
    let content = "";

    if (fileExtension === "txt") {
      content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } else if (fileExtension === "pdf") {
      // Para PDF, intentar extraer texto (requiere librería adicional)
      // Por ahora, retornar mensaje informativo
      return {
        success: false,
        error: "Soporte para PDF en desarrollo. Por favor, copia el texto directamente.",
      };
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      // Para DOCX, intentar extraer texto (requiere librería adicional)
      // Por ahora, retornar mensaje informativo
      return {
        success: false,
        error: "Soporte para DOCX en desarrollo. Por favor, copia el texto directamente.",
      };
    }

    if (!content || content.trim().length === 0) {
      return { success: false, error: "El archivo está vacío" };
    }

    return {
      success: true,
      content,
      fileName,
      fileSize: file.size,
    };
  } catch (error: any) {
    console.error("Error al cargar archivo:", error);
    return {
      success: false,
      error: error.message || "Error desconocido al cargar el archivo",
    };
  }
}

function isValidFileType(extension: string, mimeType: string): boolean {
  const ext = extension.toLowerCase();

  // Validar por extensión
  if (ext === "txt" || ext === "pdf" || ext === "doc" || ext === "docx") {
    return true;
  }

  // Validar por MIME type
  for (const [mime, exts] of Object.entries(SUPPORTED_TYPES)) {
    if (mimeType.includes(mime) || mimeType === mime) {
      return true;
    }
  }

  return false;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
