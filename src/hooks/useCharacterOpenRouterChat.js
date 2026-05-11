import { useCallback, useRef, useState } from "react";
import { buildCharacterSystemPrompt } from "../data/schoolCharacters";
import {
  isOpenRouterConfigured,
  openRouterChatCompletion,
} from "../lib/openrouter";

/** Default max tokens for streaming text chat. */
const TEXT_CHAT_MAX = 580;
/** Default max tokens for non-streaming chat (override for voice). */
const NON_STREAM_DEFAULT_MAX = 640;

/**
 * @param {import("../data/schoolCharacters").SchoolCharacter} character
 */
export function useCharacterOpenRouterChat(character) {
  const systemPrompt = buildCharacterSystemPrompt(character);

  const [messages, setMessages] = useState(() => [
    {
      id: "welcome",
      from: "character",
      body: `مرحباً! أنا ${character.name}. اسألني عن البيئة أو نادي المدرسة…`,
    },
  ]);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toApiMessages = useCallback(
    (msgs) => {
      const out = [{ role: "system", content: systemPrompt }];
      for (const m of msgs) {
        if (m.from === "user") out.push({ role: "user", content: m.body });
        else if (m.from === "character" && m.body) {
          out.push({ role: "assistant", content: m.body });
        }
      }
      return out;
    },
    [systemPrompt],
  );

  const sendUserText = useCallback(
    /**
     * @param {string} rawText
     * @param {{ stream?: boolean; maxTokens?: number }} [options]
     */
    async (rawText, options = {}) => {
      const trimmed = rawText.trim();
      if (!trimmed || isLoading) return null;

      if (!isOpenRouterConfigured()) {
        setError(
          "لم يُضبط مفتاح OpenRouter. أضف API_KEY في ملف .env (بدون مسافات حول =) ثم أعد تشغيل خادم التطوير.",
        );
        return null;
      }

      const useStream = options.stream === true;
      const maxTokens = options.maxTokens ?? (useStream ? TEXT_CHAT_MAX : NON_STREAM_DEFAULT_MAX);

      const userMsg = { id: `u-${Date.now()}`, from: "user", body: trimmed };
      const next = [...messagesRef.current, userMsg];
      messagesRef.current = next;
      setMessages(next);
      setError("");
      setIsLoading(true);

      const charId = `c-${Date.now()}`;

      try {
        if (useStream) {
          setMessages((prev) => [
            ...prev,
            { id: charId, from: "character", body: "", isStreaming: true },
          ]);

          const reply = await openRouterChatCompletion(toApiMessages(next), {
            maxTokens,
            stream: true,
            onDelta: (full) => {
              setMessages((prev) =>
                prev.map((m) => (m.id === charId ? { ...m, body: full, isStreaming: true } : m)),
              );
            },
          });

          const finalMsg = { id: charId, from: "character", body: reply.trim(), isStreaming: false };
          const withChar = [...next, finalMsg];
          messagesRef.current = withChar;
          setMessages((prev) => prev.map((m) => (m.id === charId ? finalMsg : m)));
          return reply;
        }

        const reply = await openRouterChatCompletion(toApiMessages(next), {
          maxTokens,
          stream: false,
        });
        const finalMsg = { id: charId, from: "character", body: reply };
        const withChar = [...next, finalMsg];
        messagesRef.current = withChar;
        setMessages(withChar);
        return reply;
      } catch (e) {
        if (useStream) {
          setMessages((prev) => prev.filter((m) => m.id !== charId));
        }
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "MISSING_API_KEY") {
          setError("مفتاح API غير موجود.");
        } else {
          setError(msg.length > 220 ? `${msg.slice(0, 220)}…` : msg);
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, toApiMessages],
  );

  return { messages, setMessages, isLoading, error, setError, sendUserText };
}
