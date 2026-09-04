import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getLanguageLabel(code: string): string {
  const languages: Record<string, string> = {
    hindi: "हिंदी (Hindi)",
    marathi: "मराठी (Marathi)",
    telugu: "తెలుగు (Telugu)",
    english: "English",
  };
  return languages[code] || code;
}

export function getSeasonLabel(season: string): string {
  const seasons: Record<string, string> = {
    kharif: "Kharif (Monsoon)",
    rabi: "Rabi (Winter)",
    zaid: "Zaid (Summer)",
  };
  return seasons[season] || season;
}
