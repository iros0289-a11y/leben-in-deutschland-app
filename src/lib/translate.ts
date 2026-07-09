"use client";

const API_URL = "https://api.mymemory.translated.net/get";

function cacheKey(text: string): string {
  return `leben-in-deutschland:tr:${text}`;
}

export async function translateToTurkish(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(cacheKey(trimmed));
    if (cached) {
      return cached;
    }
  }

  const url = `${API_URL}?langpair=de|tr&q=${encodeURIComponent(trimmed)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("translation_failed");
  }
  const payload = (await response.json()) as {
    responseData?: {
      translatedText?: string;
    };
  };
  const translated = payload.responseData?.translatedText?.trim();
  if (!translated) {
    throw new Error("translation_empty");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(cacheKey(trimmed), translated);
  }
  return translated;
}
