import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { characterPresenceHint } from "../data/schoolCharacters";
import {
  createSpeechMediaRecorder,
  isOpenRouterConfigured,
  openRouterTextToSpeech,
  openRouterTranscribe,
  pickAudioMimeType,
} from "../lib/openrouter";

export const MODE_TABS = [
  { mode: "text", label: "كتابة", emoji: "💬" },
  { mode: "voice", label: "صوت", emoji: "🎤" },
  { mode: "video", label: "فيديو", emoji: "📹" },
];

/** Turn scary API strings into short kid-friendly Arabic where we can. */
export function softError(raw) {
  const s = typeof raw === "string" ? raw : String(raw);
  if (/MISSING_API_KEY|API_KEY|401|403|Unauthorized/i.test(s)) {
    return "لم نستطع الاتصال. اطلب من كبير يساعدك ثم جرّب مرة ثانية.";
  }
  if (/fetch|network|Failed to fetch/i.test(s)) {
    return "الإنترنت فيه مشكلة. تأكّد من الواي فاي ثم جرّب ثانية.";
  }
  if (/NotAllowedError|ميكروفون|Microphone/i.test(s)) {
    return "المتصفح يحتاج إذناً للميكروفون. اضغط «موافق» إذا ظهر لك سؤال.";
  }
  if (s.length > 120) return `${s.slice(0, 118)}…`;
  return s;
}

export async function playMp3Buffer(arrayBuffer) {
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

export function CharacterTextChat({ character, chat }) {
  const { messages, isLoading, error, setError, sendUserText } = chat;
  const [draft, setDraft] = useState("");
  const [ttsBusyId, setTtsBusyId] = useState(null);
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  const needsSetup = !isOpenRouterConfigured();
  const devHint = needsSetup && import.meta.env.DEV;

  return (
    <div className="kid-chat-text">
      {needsSetup ? (
        <div className="kid-chat-notice" role="status">
          {import.meta.env.DEV ? (
            <>
              للمطوّرين: أضف <code className="kid-chat-code">API_KEY</code> في <code className="kid-chat-code">.env</code> ثم أعد التشغيل.
            </>
          ) : (
            <>المحادثة غير جاهزة بعد. اطلب من معلّمك أو من أحد الكبار أن يفعّلها، ثم ارجع!</>
          )}
        </div>
      ) : null}

      {error ? (
        <div className="kid-chat-oops" role="alert">
          {softError(error)}
        </div>
      ) : null}

      <div className="kid-chat-messages" role="log" aria-live="polite">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`kid-chat-msg${m.from === "user" ? " kid-chat-msg--me" : " kid-chat-msg--friend"}`}
          >
            <div
              className={`kid-chat-bubble${m.isStreaming ? " kid-chat-bubble--typing" : ""}`}
            >
              {m.from === "character" ? (
                <span className="kid-chat-bubble-name">{character.name}</span>
              ) : null}
              <span className="kid-chat-bubble-text">{m.body || (m.isStreaming ? "…" : "")}</span>
            </div>
            {m.from === "character" && isOpenRouterConfigured() && !m.isStreaming && m.body ? (
              <button
                type="button"
                className="kid-chat-listen"
                disabled={ttsBusyId === m.id || isLoading}
                onClick={() => speakMessage(m.id, m.body)}
                aria-label="اسمع الرد"
              >
                {ttsBusyId === m.id ? "⏳" : "🔊"}
              </button>
            ) : null}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="kid-chat-composer">
        <textarea
          className="kid-chat-field"
          rows={1}
          placeholder={`قل شيئاً لـ ${character.name}…`}
          value={draft}
          disabled={isLoading || needsSetup}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button
          type="button"
          className="kid-chat-send"
          disabled={isLoading || needsSetup || !draft.trim()}
          onClick={onSend}
          aria-label="أرسل"
        >
          {isLoading ? "…" : "➤"}
        </button>
      </div>

      {devHint ? (
        <p className="kid-chat-devnote">وضع التطوير — الرسالة أعلاه للمطوّرين فقط.</p>
      ) : null}
    </div>
  );
}

export function CharacterVoiceChat({ character, chat }) {
  const { isLoading, error, setError, sendUserText } = chat;
  const [phase, setPhase] = useState("idle");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const needsSetup = !isOpenRouterConfigured();

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
    if (needsSetup) return;
    if (phase !== "idle" || isLoading) return;

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
          setError("صوتك قصير جداً 🎤 كلّم أطول شوي ثم أوّق بنفس الزر.");
          return;
        }

        setPhase("transcribing");
        try {
          const ext = blob.type.includes("mp4") ? "m4a" : "webm";
          const text = await openRouterTranscribe(blob, `clip.${ext}`);
          setPhase("idle");
          const reply = await sendUserText(text, { stream: false, maxTokens: 300 });
          if (reply) {
            setPhase("voice_prep");
            try {
              const forTts = reply.length > 900 ? `${reply.slice(0, 897)}…` : reply;
              const buf = await openRouterTextToSpeech(forTts);
              setPhase("speaking");
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
          ? "المتصفح يحتاج إذناً للميكروفون. اضغط «موافق» إذا ظهر لك سؤال."
          : "ما قدرنا نفتح الميكروفون. جرّب جهازاً ثانياً.",
      );
      setPhase("idle");
      stopStream();
    }
  }, [phase, isLoading, needsSetup, sendUserText, setError, stopStream]);

  const micDisabled = needsSetup || (phase !== "recording" && (phase !== "idle" || isLoading));

  const onMicPress = useCallback(() => {
    if (needsSetup) return;
    if (phase === "recording") {
      stopRecording();
      return;
    }
    if (phase === "idle" && !isLoading) void startRecording();
  }, [needsSetup, phase, isLoading, stopRecording, startRecording]);

  const hint = characterPresenceHint(character, { phase, isLoading, surface: "voice" });

  return (
    <div className="kid-chat-audio">
      {needsSetup ? (
        <div className="kid-chat-notice" role="status">
          {import.meta.env.DEV ? (
            <>
              للمطوّرين: أضف <code className="kid-chat-code">API_KEY</code> في <code className="kid-chat-code">.env</code>.
            </>
          ) : (
            <>المحادثة غير جاهزة بعد. اطلب من كبير أن يفعّلها!</>
          )}
        </div>
      ) : null}

      {error ? (
        <div className="kid-chat-oops" role="alert">
          {softError(error)}
        </div>
      ) : null}

      <div className={`kid-chat-mic-ring${phase === "recording" ? " is-live" : ""}`} aria-hidden>
        <div className="kid-chat-mic-face">🎤</div>
      </div>

      <p className="kid-chat-hint">{hint}</p>

      <div className="kid-chat-micbtn-wrap">
        <button
          type="button"
          className={`kid-chat-micbtn${phase === "recording" ? " kid-chat-micbtn--stop" : ""}`}
          disabled={micDisabled}
          onClick={onMicPress}
          aria-label={
            phase === "recording"
              ? "أوقف التسجيل وأرسل"
              : phase === "idle" && !isLoading
                ? "ابدأ التسجيل"
                : "انتظر"
          }
        >
          {phase === "recording" ? (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                ⏹️
              </span>
              أوّق وأرسل
            </>
          ) : phase === "idle" && !isLoading ? (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                🎙️
              </span>
              اضغط وكلّمني
            </>
          ) : (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                ⏳
              </span>
              لحظة…
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function videoMoodFromPhase({ phase, isLoading }) {
  if (phase === "recording") return "listening";
  if (phase === "transcribing") return "thinking";
  if (phase === "voice_prep") return "thinking";
  if (phase === "speaking") return "speaking";
  if (isLoading) return "thinking";
  return "listening";
}

export function CharacterVideoChat({ character, chat }) {
  const clips = character.videoCall;
  const { isLoading, error, setError, sendUserText } = chat;
  const [phase, setPhase] = useState("idle");
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const listenRef = useRef(null);
  const thinkRef = useRef(null);
  const speakRef = useRef(null);

  const needsSetup = !isOpenRouterConfigured();
  const mood = videoMoodFromPhase({ phase, isLoading });

  useEffect(() => {
    const map = { listening: listenRef, thinking: thinkRef, speaking: speakRef };
    for (const key of ["listening", "thinking", "speaking"]) {
      const el = map[key].current;
      if (!el) continue;
      if (key === mood) el.play().catch(() => {});
      else el.pause();
    }
  }, [mood]);

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
    if (needsSetup) return;
    if (phase !== "idle" || isLoading) return;

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
          setError("صوتك قصير جداً 🎤 كلّم أطول شوي ثم أوّق بنفس الزر.");
          return;
        }

        setPhase("transcribing");
        try {
          const ext = blob.type.includes("mp4") ? "m4a" : "webm";
          const text = await openRouterTranscribe(blob, `clip.${ext}`);
          setPhase("idle");
          const reply = await sendUserText(text, { stream: false, maxTokens: 300 });
          if (reply) {
            setPhase("voice_prep");
            try {
              const forTts = reply.length > 900 ? `${reply.slice(0, 897)}…` : reply;
              const buf = await openRouterTextToSpeech(forTts);
              setPhase("speaking");
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
          ? "المتصفح يحتاج إذناً للميكروفون. اضغط «موافق» إذا ظهر لك سؤال."
          : "ما قدرنا نفتح الميكروفون. جرّب جهازاً ثانياً.",
      );
      setPhase("idle");
      stopStream();
    }
  }, [phase, isLoading, needsSetup, sendUserText, setError, stopStream]);

  const micDisabled = needsSetup || (phase !== "recording" && (phase !== "idle" || isLoading));

  const onMicPress = useCallback(() => {
    if (needsSetup) return;
    if (phase === "recording") {
      stopRecording();
      return;
    }
    if (phase === "idle" && !isLoading) void startRecording();
  }, [needsSetup, phase, isLoading, stopRecording, startRecording]);

  const hint = characterPresenceHint(character, { phase, isLoading, surface: "video" });

  if (!clips) return null;

  return (
    <div className="kid-chat-video">
      {needsSetup ? (
        <div className="kid-chat-notice" role="status">
          {import.meta.env.DEV ? (
            <>
              للمطوّرين: أضف <code className="kid-chat-code">API_KEY</code> في <code className="kid-chat-code">.env</code>.
            </>
          ) : (
            <>المحادثة غير جاهزة بعد. اطلب من كبير أن يفعّلها!</>
          )}
        </div>
      ) : null}

      {error ? (
        <div className="kid-chat-oops" role="alert">
          {softError(error)}
        </div>
      ) : null}

      <div className="kid-chat-screen" aria-hidden>
        <video
          ref={listenRef}
          className={`kid-chat-screen-v${mood === "listening" ? " is-on" : ""}`}
          src={clips.listening}
          playsInline
          muted
          loop
          preload="auto"
        />
        <video
          ref={thinkRef}
          className={`kid-chat-screen-v${mood === "thinking" ? " is-on" : ""}`}
          src={clips.thinking}
          playsInline
          muted
          loop
          preload="auto"
        />
        <video
          ref={speakRef}
          className={`kid-chat-screen-v${mood === "speaking" ? " is-on" : ""}`}
          src={clips.speaking}
          playsInline
          muted
          loop
          preload="auto"
        />
      </div>

      <p className="kid-chat-hint">{hint}</p>

      <div className="kid-chat-micbtn-wrap">
        <button
          type="button"
          className={`kid-chat-micbtn${phase === "recording" ? " kid-chat-micbtn--stop" : ""}`}
          disabled={micDisabled}
          onClick={onMicPress}
          aria-label={
            phase === "recording"
              ? "أوقف التسجيل وأرسل"
              : phase === "idle" && !isLoading
                ? "ابدأ التسجيل"
                : "انتظر"
          }
        >
          {phase === "recording" ? (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                ⏹️
              </span>
              أوّق وأرسل
            </>
          ) : phase === "idle" && !isLoading ? (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                🎙️
              </span>
              اضغط وكلّمني
            </>
          ) : (
            <>
              <span className="kid-chat-micbtn-ico" aria-hidden>
                ⏳
              </span>
              لحظة…
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   character: { slug: string; name: string; img: string; videoCall?: object; feminineArabic?: boolean };
 *   mode: string;
 *   profilePath: string;
 *   peerSubtitle?: string;
 *   useChatHook: (c: unknown) => object;
 *   scopeClassName?: string;
 * }} props
 */
export function KidChatSession({
  character,
  mode,
  profilePath,
  peerSubtitle,
  useChatHook,
  scopeClassName = "",
}) {
  const chat = useChatHook(character);
  const base = `${profilePath}/chat`;
  const rootClass = ["kid-chat", scopeClassName].filter(Boolean).join(" ");

  return (
    <div className={rootClass} dir="rtl" data-mys-character={character.slug}>
      <header className="kid-chat-top">
        <Link to={profilePath} className="kid-chat-back">
          <span className="kid-chat-back-ico" aria-hidden>
            →
          </span>
          <span>رجوع</span>
        </Link>
        <div className="kid-chat-peer">
          <img className="kid-chat-peer-img" src={character.img} alt="" draggable={false} />
          <div>
            <div className="kid-chat-peer-name">{character.name}</div>
            {peerSubtitle ? (
              <div className="kid-chat-peer-tag">{peerSubtitle}</div>
            ) : null}
          </div>
        </div>
      </header>

      <nav className="kid-chat-tabs" aria-label="طريقة الكلام">
        {MODE_TABS.filter((t) => t.mode !== "video" || character.videoCall).map(({ mode: m, label, emoji }) => (
          <NavLink
            key={m}
            to={`${base}/${m}`}
            className={({ isActive }) => `kid-chat-tab${isActive ? " is-active" : ""}`}
          >
            <span className="kid-chat-tab-emoji" aria-hidden>
              {emoji}
            </span>
            {label}
          </NavLink>
        ))}
      </nav>

      <main className="kid-chat-body">
        {mode === "text" ? <CharacterTextChat character={character} chat={chat} /> : null}
        {mode === "voice" ? <CharacterVoiceChat character={character} chat={chat} /> : null}
        {mode === "video" && character.videoCall ? <CharacterVideoChat character={character} chat={chat} /> : null}
      </main>
    </div>
  );
}
