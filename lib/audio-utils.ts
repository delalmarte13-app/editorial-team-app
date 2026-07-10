/**
 * Audio Utilities - Text-to-Speech and Speech-to-Text
 */

import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

export interface SpeechOptions {
  text: string;
  language?: string;
  rate?: number; // 0.5 - 2.0
  pitch?: number; // 0.5 - 2.0
  volume?: number; // 0 - 1
}

export interface RecordingOptions {
  duration?: number; // in milliseconds
  onProgress?: (duration: number) => void;
}

/**
 * Speak text using TTS
 */
export async function speakText(options: SpeechOptions): Promise<void> {
  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak the text
    await Speech.speak(options.text, {
      language: options.language || "es-ES",
      rate: options.rate || 1,
      pitch: options.pitch || 1,
      volume: options.volume || 1,
    });
  } catch (error) {
    console.error("Speech error:", error);
    throw new Error("Failed to speak text");
  }
}

/**
 * Stop speaking
 */
export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.error("Stop speech error:", error);
  }
}

/**
 * Check if speech is available
 */
export async function isSpeechAvailable(): Promise<boolean> {
  try {
    const available = await Speech.isSpeakingAsync();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get available voices
 */
export async function getAvailableVoices(): Promise<
  Array<{
    identifier: string;
    name: string;
    language: string;
  }>
> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices;
  } catch (error) {
    console.error("Get voices error:", error);
    return [];
  }
}

/**
 * Initialize audio recording
 */
export async function initializeAudioRecording(): Promise<void> {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  } catch (error) {
    console.error("Audio initialization error:", error);
    throw new Error("Failed to initialize audio");
  }
}

/**
 * Record audio
 */
export async function recordAudio(
  options: RecordingOptions = {}
): Promise<{ uri: string; duration: number }> {
  try {
    await initializeAudioRecording();

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();

    // Wait for specified duration or user stops
    if (options.duration) {
      await new Promise((resolve) => setTimeout(resolve, options.duration));
      await recording.stopAndUnloadAsync();
    }

    const uri = recording.getURI();
    const status = await recording.getStatusAsync();

    if (!uri) {
      throw new Error("Failed to get recording URI");
    }

    return {
      uri,
      duration: (status as any).durationMillis || 0,
    };
  } catch (error) {
    console.error("Recording error:", error);
    throw new Error("Failed to record audio");
  }
}

/**
 * Play audio file
 */
export async function playAudio(uri: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  } catch (error) {
    console.error("Playback error:", error);
    throw new Error("Failed to play audio");
  }
}

/**
 * Delete audio file
 */
export async function deleteAudioFile(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error("Delete audio error:", error);
    throw new Error("Failed to delete audio file");
  }
}

/**
 * Get audio duration
 */
export async function getAudioDuration(uri: string): Promise<number> {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    const status = await sound.getStatusAsync();
    await sound.unloadAsync();

    return (status as any).durationMillis || 0;
  } catch (error) {
    console.error("Get duration error:", error);
    return 0;
  }
}

/**
 * Format duration for display
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Check microphone permission
 */
export async function checkMicrophonePermission(): Promise<boolean> {
  try {
    const permission = await Audio.getPermissionsAsync();
    return permission.status === "granted";
  } catch {
    return false;
  }
}

/**
 * Request microphone permission
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const permission = await Audio.requestPermissionsAsync();
    return permission.status === "granted";
  } catch {
    return false;
  }
}
