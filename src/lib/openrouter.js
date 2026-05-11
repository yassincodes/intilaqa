/** OpenRouter — chat, speech-to-text, text-to-speech (see https://openrouter.ai/docs) */

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

/** Cheap, strong chat model on OpenRouter */
export const CHAT_MODEL = "openai/gpt-4o-mini";

/** Faster STT than whisper-large-v3 (good enough for short clips) */
export const STT_MODEL = "openai/whisper-1";

/** OpenAI TTS via OpenRouter (see multimodal TTS guide) */
export const TTS_MODEL = "openai/gpt-4o-mini-tts-2025-12-15";

/** OpenRouter headers must be ISO-8859-1; no Arabic or Unicode in header values. */
function refererHeaders() {
  const title = "Al-Intilaqa Eco School";
  if (typeof window === "undefined") {
    return { "HTTP-Referer": "http://localhost:5173", "X-Title": title };
  }
  return {
    "HTTP-Referer": window.location.origin,
    "X-Title": title,
  };
}

export function getOpenRouterApiKey() {
  const k = import.meta.env.OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY || "";
  return typeof k === "string" ? k.trim() : "";
}

export function isOpenRouterConfigured() {
  return getOpenRouterApiKey().length > 0;
}

const DEFAULT_CHAT_MAX_TOKENS = 640;

/**
 * @param {Array<{ role: string; content: string }>} messages
 * @param {{
 *   signal?: AbortSignal;
 *   maxTokens?: number;
 *   stream?: boolean;
 *   onDelta?: (fullText: string, delta: string) => void;
 * }} [opts]
 */
export async function openRouterChatCompletion(messages, opts = {}) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const max_tokens = opts.maxTokens ?? DEFAULT_CHAT_MAX_TOKENS;
  const useStream = opts.stream === true;

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...refererHeaders(),
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      max_tokens,
      temperature: 0.55,
      ...(useStream ? { stream: true } : {}),
    }),
    signal: opts.signal,
  });

  if (!res.ok) {
    const text = await res.text();
    let detail = text;
    try {
      const j = JSON.parse(text);
      detail = j?.error?.message || j?.message || text;
    } catch {
      /* keep text */
    }
    throw new Error(detail || `Chat HTTP ${res.status}`);
  }

  if (useStream) {
    const body = res.body;
    if (!body) {
      throw new Error("EMPTY_STREAM");
    }
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let carry = "";
    let full = "";
    const handleSseLine = (line) => {
      const t = line.trim();
      if (!t.startsWith("data:")) return;
      const data = t.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const j = JSON.parse(data);
        const piece =
          j?.choices?.[0]?.delta?.content ?? j?.choices?.[0]?.message?.content ?? "";
        if (piece) {
          full += piece;
          opts.onDelta?.(full, piece);
        }
      } catch {
        /* ignore partial JSON */
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      carry += decoder.decode(value, { stream: true });
      const parts = carry.split("\n");
      carry = parts.pop() ?? "";
      for (const line of parts) {
        handleSseLine(line);
      }
    }
    if (carry.trim()) {
      handleSseLine(carry);
    }
    const out = full.trim();
    if (!out) {
      throw new Error("EMPTY_RESPONSE");
    }
    return out;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("EMPTY_RESPONSE");
  }
  return content.trim();
}

/**
 * @param {string} text
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<ArrayBuffer>}
 */
export async function openRouterTextToSpeech(text, opts = {}) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const input = text.length > 3800 ? `${text.slice(0, 3797)}…` : text;

  const res = await fetch(`${OPENROUTER_BASE}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...refererHeaders(),
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      input,
      voice: "nova",
      response_format: "mp3",
    }),
    signal: opts.signal,
  });

  if (!res.ok) {
    const textErr = await res.text();
    let detail = textErr;
    try {
      const j = JSON.parse(textErr);
      detail = j?.error?.message || textErr;
    } catch {
      /* keep */
    }
    throw new Error(detail || `TTS HTTP ${res.status}`);
  }

  return res.arrayBuffer();
}

/**
 * Base64 (no data: prefix) for OpenRouter STT JSON body.
 * @param {Blob} blob
 */
async function blobToBase64(blob) {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const sub = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, sub);
  }
  return btoa(binary);
}

/** Map blob MIME to OpenRouter `input_audio.format` (wav | mp3 | webm | m4a | ogg | flac | aac). */
function inferAudioFormat(blob) {
  const t = (blob.type || "").toLowerCase();
  if (t.includes("webm")) return "webm";
  if (t.includes("mp4") || t.includes("m4a")) return "m4a";
  if (t.includes("ogg")) return "ogg";
  if (t.includes("mpeg") || t.includes("mp3")) return "mp3";
  if (t.includes("wav")) return "wav";
  if (t.includes("flac")) return "flac";
  if (t.includes("aac")) return "aac";
  return "webm";
}

/**
 * OpenRouter STT expects JSON + base64 `input_audio`, not multipart (see multimodal STT guide).
 * @param {Blob} audioBlob
 * @param {string} [_filename] unused; kept for call-site compatibility
 * @param {{ signal?: AbortSignal }} [opts]
 */
export async function openRouterTranscribe(audioBlob, _filename = "audio.webm", opts = {}) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const dataB64 = await blobToBase64(audioBlob);
  const format = inferAudioFormat(audioBlob);

  const res = await fetch(`${OPENROUTER_BASE}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...refererHeaders(),
    },
    body: JSON.stringify({
      model: STT_MODEL,
      input_audio: {
        data: dataB64,
        format,
      },
    }),
    signal: opts.signal,
  });

  const raw = await res.text();

  if (!res.ok) {
    let detail = raw.slice(0, 500);
    try {
      const j = JSON.parse(raw);
      detail = j?.error?.message || j?.message || detail;
    } catch {
      /* keep truncated raw */
    }
    throw new Error(detail || `STT HTTP ${res.status}`);
  }

  let text = "";
  try {
    const parsed = JSON.parse(raw);
    text = typeof parsed?.text === "string" ? parsed.text.trim() : "";
  } catch {
    // Some gateways return plain text; avoid res.json() on non-JSON (fixes "minus sign" parse errors).
    text = raw.trim();
  }

  if (!text) {
    throw new Error("EMPTY_TRANSCRIPTION");
  }
  return text;
}

/** Pick a MediaRecorder mimeType browsers often support for Whisper/webm. */
export function pickAudioMimeType() {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
    return "";
  }
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

/**
 * Smaller mic files → faster upload + STT. Falls back if the browser rejects options.
 * @param {MediaStream} stream
 * @param {string} mime
 */
export function createSpeechMediaRecorder(stream, mime) {
  if (mime) {
    try {
      return new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 56000 });
    } catch {
      try {
        return new MediaRecorder(stream, { mimeType: mime });
      } catch {
        /* fall through */
      }
    }
  }
  try {
    return new MediaRecorder(stream, { audioBitsPerSecond: 56000 });
  } catch {
    return new MediaRecorder(stream);
  }
}
