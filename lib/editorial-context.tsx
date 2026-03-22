import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SpecialistStatus = "idle" | "analyzing" | "ready" | "error";

export type SpecialistId =
  | "corrector"
  | "analyst"
  | "editor"
  | "translator"
  | "kdp"
  | "marketing"
  | "illustrator"
  | "economist";

export interface SpecialistResult {
  id: SpecialistId;
  status: SpecialistStatus;
  result?: string;
  error?: string;
  generatedAt?: number;
}

export interface TextEntry {
  id: string;
  text: string;
  title: string;
  createdAt: number;
  wordCount: number;
}

interface EditorialContextType {
  currentText: string;
  setCurrentText: (text: string) => void;
  specialists: Record<SpecialistId, SpecialistResult>;
  setSpecialistResult: (id: SpecialistId, result: Partial<SpecialistResult>) => void;
  resetSpecialists: () => void;
  history: TextEntry[];
  addToHistory: (text: string) => void;
  loadFromHistory: (entry: TextEntry) => void;
  removeFromHistory: (id: string) => void;
  isAnalyzing: boolean;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const defaultSpecialists: Record<SpecialistId, SpecialistResult> = {
  corrector:  { id: "corrector",  status: "idle" },
  analyst:    { id: "analyst",    status: "idle" },
  editor:     { id: "editor",     status: "idle" },
  translator: { id: "translator", status: "idle" },
  kdp:        { id: "kdp",        status: "idle" },
  marketing:  { id: "marketing",  status: "idle" },
  illustrator:{ id: "illustrator",status: "idle" },
  economist:  { id: "economist",  status: "idle" },
};

const EditorialContext = createContext<EditorialContextType | null>(null);

const HISTORY_KEY = "editorial_history_v1";

export function EditorialProvider({ children }: { children: React.ReactNode }) {
  const [currentText, setCurrentTextState] = useState("");
  const [specialists, setSpecialists] = useState<Record<SpecialistId, SpecialistResult>>(defaultSpecialists);
  const [history, setHistory] = useState<TextEntry[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const isAnalyzing = Object.values(specialists).some((s) => s.status === "analyzing");

  const setCurrentText = useCallback((text: string) => {
    setCurrentTextState(text);
  }, []);

  const setSpecialistResult = useCallback((id: SpecialistId, update: Partial<SpecialistResult>) => {
    setSpecialists((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...update },
    }));
  }, []);

  const resetSpecialists = useCallback(() => {
    setSpecialists(defaultSpecialists);
  }, []);

  const addToHistory = useCallback(async (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const title = text.trim().split(/[.!?\n]/)[0].slice(0, 60) || "Texto sin título";
    const entry: TextEntry = {
      id: Date.now().toString(),
      text,
      title,
      createdAt: Date.now(),
      wordCount: words,
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const loadFromHistory = useCallback((entry: TextEntry) => {
    setCurrentTextState(entry.text);
    resetSpecialists();
  }, [resetSpecialists]);

  const removeFromHistory = useCallback(async (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  // Load history on mount
  React.useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((raw) => {
      if (raw) {
        try {
          setHistory(JSON.parse(raw));
        } catch {}
      }
    });
  }, []);

  return (
    <EditorialContext.Provider
      value={{
        currentText,
        setCurrentText,
        specialists,
        setSpecialistResult,
        resetSpecialists,
        history,
        addToHistory,
        loadFromHistory,
        removeFromHistory,
        isAnalyzing,
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </EditorialContext.Provider>
  );
}

export function useEditorial() {
  const ctx = useContext(EditorialContext);
  if (!ctx) throw new Error("useEditorial must be used within EditorialProvider");
  return ctx;
}
