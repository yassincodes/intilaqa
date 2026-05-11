import { useCallback, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { C, fadeUp } from "../theme";
import { getCharacterBySlug, isValidChatMode } from "../data/schoolCharacters";
import { useCharacterOpenRouterChat } from "../hooks/useCharacterOpenRouterChat";
import {
  CHAT_MODEL,
  STT_MODEL,
  TTS_MODEL,
  createSpeechMediaRecorder,
  isOpenRouterConfigured,
  openRouterTextToSpeech,
  openRouterTranscribe,
  pickAudioMimeType,
} from "../lib/openrouter";

const MODE_HEADINGS = {
  text: "محادثة نصية",
  voice: "محادثة صوتية",
  video: "محادثة بالفيديو",
};

async function playMp3Buffer(arrayBuffer) {
  const url = URL.createObjectURL(new Blob([arrayBuffer], { type: "audio/mpeg" }));
  const audio = new Audio(url);
  try {
    await new Promise((resolve, reject) => {
      audio.addEventListener("ended", () => resolve());
      audio.addEventListener("error", () => reject(new Error("AUDIO_PLAYBACK")));
      audio.play().catch(reject);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function CharacterTextChat({ chat }) {
  const { messages, isLoading, error, setError, sendUserText } = chat;
  const [draft, setDraft] = useState("");
  const [ttsBusyId, setTtsBusyId] = useState(null);

  const onSend = useCallback(async () => {
    const t = draft.trim();
    if (!t || isLoading) return;
    setDraft("");
    await sendUserText(t, { stream: true });
  }, [draft, isLoading, sendUserText]);

  const speakMessage = useCallback(
    async (id, body) => {
      if (!isOpenRouterConfigured() || !body) return;
      setTtsBusyId(id);
      setError("");
      try {
        const buf = await openRouterTextToSpeech(body);
        await playMp3Buffer(buf);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setTtsBusyId(null);
      }
    },
    [setError],
  );

  return (
    <div className="character-text-chat">
      {!isOpenRouterConfigured() ? (
        <div className="character-api-banner" role="status">
          أضف مفتاح OpenRouter في ملف <code className="character-api-code">.env</code> باسم{" "}
          <code className="character-api-code">API_KEY</code> ثم أعد تشغيل{" "}
          <code className="character-api-code">npm run dev</code>.
        </div>
      ) : null}

      {error ? (
        <div className="character-api-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="character-text-chat-log" role="log" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.from === "user" ? "character-text-row is-user" : "character-text-row is-character"
            }
          >
            <div
              className={
                m.from === "user"
                  ? "character-text-bubble is-user"
                  : `character-text-bubble is-character${m.isStreaming ? " is-streaming" : ""}`
              }
            >
              {m.body || (m.isStreaming ? "…" : "")}
            </div>
            {m.from === "character" && isOpenRouterConfigured() && !m.isStreaming && m.body ? (
              <button
                type="button"
                className="character-tts-btn"
                disabled={ttsBusyId === m.id || isLoading}
                onClick={() => speakMessage(m.id, m.body)}
                title="استمع للرد"
              >
                {ttsBusyId === m.id ? "…" : "🔊"}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="character-text-chat-inputRow">
        <textarea
          className="character-text-chat-input"
          rows={2}
          placeholder="اكتب رسالتك…"
          value={draft}
          disabled={isLoading}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button type="button" className="character-text-chat-send" disabled={isLoading} onClick={onSend}>
          {isLoading ? "…" : "إرسال"}
        </button>
      </div>
      <p className="character-chat-disclaimer" style={{ color: C.muted }}>
        النماذج عبر OpenRouter: محادثة <code className="character-api-code">{CHAT_MODEL}</code> (بث تدريجي)، وصوت{" "}
        <code className="character-api-code">{TTS_MODEL}</code>. لا تشارك معلومات سرية في المحادثة.
      </p>
    </div>
  );
}

function CharacterVoiceChat({ character, chat }) {
  const { isLoading, error, setError, sendUserText } = chat;
  const [phase, setPhase] = useState("idle");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const busy = phase !== "idle" || isLoading;

  const stopStream = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state === "recording") mr.stop();
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    if (!isOpenRouterConfigured()) {
      setError("أضف API_KEY في ملف .env ثم أعد تشغيل الخادم.");
      return;
    }
    if (busy) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickAudioMimeType();
      const mr = createSpeechMediaRecorder(stream, mime);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stopStream();
        mediaRecorderRef.current = null;
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        chunksRef.current = [];

        if (blob.size < 400) {
          setPhase("idle");
          setError("التسجيل قصير جداً. جرّب الضغط مطوّلاً قليلاً ثم الإيقاف.");
          return;
        }

        setPhase("transcribing");
        try {
          const ext = blob.type.includes("mp4") ? "m4a" : "webm";
          const text = await openRouterTranscribe(blob, `clip.${ext}`);
          setPhase("idle");
          const reply = await sendUserText(text, { stream: false, maxTokens: 300 });
          if (reply) {
            setPhase("speaking");
            try {
              const forTts = reply.length > 900 ? `${reply.slice(0, 897)}…` : reply;
              const buf = await openRouterTextToSpeech(forTts);
              await playMp3Buffer(buf);
            } catch (ttsErr) {
              setError(ttsErr instanceof Error ? ttsErr.message : String(ttsErr));
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setPhase("idle");
        }
      };

      mediaRecorderRef.current = mr;
      mr.start(400);
      setPhase("recording");
    } catch (e) {
      setError(
        e instanceof Error && e.name === "NotAllowedError"
          ? "يُرجى السماح باستخدام الميكروفون من شريط العنوان أو إعدادات المتصفح."
          : "تعذّر فتح الميكروفون.",
      );
      setPhase("idle");
      stopStream();
    }
  }, [busy, sendUserText, setError, stopStream]);

  const label =
    phase === "recording"
      ? "جارٍ التسجيل… اضغط «إيقاف» عند الانتهاء"
      : phase === "transcribing"
        ? `جاري تحويل الصوت إلى نص (${STT_MODEL})…`
        : phase === "speaking"
          ? `تشغيل رد ${character.name} كصوت…`
          : isLoading
            ? `جاري صياغة الرد (${CHAT_MODEL})…`
            : "اضغط «تحدث» ثم «إيقاف». للسرعة: تسجيل قصير (حوالي 5–15 ثانية) يقلّل وقت التحويل والصوت.";

  return (
    <div className="character-voice-chat">
      {!isOpenRouterConfigured() ? (
        <div className="character-api-banner" role="status">
          أضف <code className="character-api-code">API_KEY</code> في <code className="character-api-code">.env</code>{" "}
          ثم أعد تشغيل التطوير.
        </div>
      ) : null}

      {error ? (
        <div className="character-api-error" role="alert">
          {error}
        </div>
      ) : null}

      <div className={`character-voice-visual${phase === "recording" ? " is-recording" : ""}`} aria-hidden>
        <span className="character-voice-pulse" />
        <span className="character-voice-mic">🎙️</span>
      </div>

      <p className="character-voice-hint" style={{ color: C.muted }}>
        {label}
      </p>

      <div className="character-voice-actions">
        <button
          type="button"
          className="btn-eco character-voice-btn"
          disabled={busy}
          onClick={startRecording}
        >
          تحدث
        </button>
        <button
          type="button"
          className="btn-outline-eco character-voice-btn"
          disabled={phase !== "recording"}
          onClick={stopRecording}
        >
          إيقاف وإرسال
        </button>
      </div>

      <p className="character-chat-disclaimer" style={{ color: C.muted }}>
        الصوت: <code className="character-api-code">{STT_MODEL}</code> ثم{" "}
        <code className="character-api-code">{CHAT_MODEL}</code> ثم{" "}
        <code className="character-api-code">{TTS_MODEL}</code>. يمكنك أيضاً{" "}
        <Link to={`/characters/${character.slug}/chat/text`}>المحادثة النصية</Link>.
      </p>
    </div>
  );
}

function CharacterChatBody({ character, mode }) {
  const heading = MODE_HEADINGS[mode];
  const chat = useCharacterOpenRouterChat(character);

  return (
    <div className="character-chat-page" dir="rtl">
      <div className="character-chat-page-inner">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <div className="character-chat-page-bar">
            <Link to={`/characters/${character.slug}`} className="character-back">
              ← {character.name}
            </Link>
            <span className="character-chat-page-mode">{heading}</span>
          </div>

          {mode === "text" ? <CharacterTextChat chat={chat} /> : null}
          {mode === "voice" ? <CharacterVoiceChat character={character} chat={chat} /> : null}

          {mode === "video" ? (
            <div className="character-placeholder-chat">
              <div className="character-placeholder-video" aria-hidden>
                <img src={character.img} alt="" draggable={false} className="character-placeholder-video-img" />
                <div className="character-placeholder-video-overlay">
                  <span>📹</span>
                </div>
              </div>
              <h2 className="character-placeholder-title" style={{ color: C.text }}>
                مكالمة فيديو مع {character.name}
              </h2>
              <p className="character-placeholder-body" style={{ color: C.muted }}>
                ستظهر هنا نافذة الكاميرا والاتصال المرئي بعد تفعيل البنية الآمنة للمدرسة (WebRTC أو مزود خارجي).
              </p>
              <Link to={`/characters/${character.slug}/chat/text`} className="btn-eco character-placeholder-cta">
                انتقل إلى النص
              </Link>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

export default function CharacterChatPage() {
  const { slug, mode } = useParams();
  const character = getCharacterBySlug(slug);

  if (!character) {
    return <Navigate to="/eco-friends" replace />;
  }
  if (!isValidChatMode(mode)) {
    return <Navigate to={`/characters/${character.slug}`} replace />;
  }

  return <CharacterChatBody key={`${character.slug}-${mode}`} character={character} mode={mode} />;
}
