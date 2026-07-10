/**
 * File Parser - Extract text from various file formats
 */

import * as FileSystem from "expo-file-system/legacy";

export interface ParsedFile {
  name: string;
  type: string;
  text: string;
  wordCount: number;
  characterCount: number;
}

/**
 * Parse text file
 */
async function parseTxt(uri: string, name: string): Promise<ParsedFile> {
  const content = await FileSystem.readAsStringAsync(uri);
  return {
    name,
    type: "text/plain",
    text: content,
    wordCount: content.split(/\s+/).filter((w) => w.length > 0).length,
    characterCount: content.length,
  };
}

/**
 * Parse PDF file (basic text extraction)
 * Note: This is a simplified version. For production, use a proper PDF library.
 */
async function parsePdf(uri: string, name: string): Promise<ParsedFile> {
  // For now, we'll return a placeholder
  // In production, use pdfjs-dist or similar
  const content = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Simple heuristic: extract printable text from base64
  const text = Buffer.from(content, "base64")
    .toString("utf-8", 0, 10000)
    .replace(/[^\x20-\x7E\n]/g, "")
    .trim();

  return {
    name,
    type: "application/pdf",
    text: text || "[PDF content could not be extracted. Please paste the text manually.]",
    wordCount: text.split(/\s+/).filter((w) => w.length > 0).length,
    characterCount: text.length,
  };
}

/**
 * Parse DOCX file (basic text extraction)
 * Note: This is a simplified version. For production, use mammoth or similar.
 */
async function parseDocx(uri: string, name: string): Promise<ParsedFile> {
  // For now, we'll return a placeholder
  // In production, use mammoth.js or similar
  const content = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Simple heuristic: extract printable text from base64
  const text = Buffer.from(content, "base64")
    .toString("utf-8", 0, 10000)
    .replace(/[^\x20-\x7E\n]/g, "")
    .trim();

  return {
    name,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    text: text || "[DOCX content could not be extracted. Please paste the text manually.]",
    wordCount: text.split(/\s+/).filter((w) => w.length > 0).length,
    characterCount: text.length,
  };
}

/**
 * Parse file based on MIME type
 */
export async function parseFile(
  uri: string,
  mimeType: string,
  name: string
): Promise<ParsedFile> {
  try {
    if (mimeType === "text/plain") {
      return await parseTxt(uri, name);
    } else if (mimeType === "application/pdf") {
      return await parsePdf(uri, name);
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await parseDocx(uri, name);
    } else {
      // Try as text
      return await parseTxt(uri, name);
    }
  } catch (error) {
    console.error("File parsing error:", error);
    throw new Error(`Failed to parse file: ${name}`);
  }
}

/**
 * Get file extension from URI
 */
export function getFileExtension(uri: string): string {
  const parts = uri.split(".");
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    txt: "text/plain",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
  };
  return mimeTypes[extension.toLowerCase()] || "text/plain";
}

/**
 * Validate file size (max 10MB)
 */
export function validateFileSize(sizeInBytes: number, maxSizeInMB: number = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
}

/**
 * Format file size for display
 */
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
