import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { C, E, fadeUp, stagger } from "../theme";
import {
  getMoyassinChatCharacter,
  isValidMoyassinChatSlug,
  MOYASSIN_BIRD,
  TEACHER_ROLE_AR,
} from "../data/moyassinRoute";
import { CHAT_MODES } from "../data/schoolCharacters";

const CHAT_LABELS = {
  text: { title: "محادثة نصية", desc: "اكتب وتلقَّ رداً من الشخصية.", icon: "💬" },
  voice: { title: "محادثة صوتية", desc: "كلّم الشخصية بصوتك.", icon: "🎙️" },
  video: { title: "محادثة بالفيديو", desc: "شاهد الشخصية أثناء الحوار.", icon: "📹" },
};

export default function MoyassinCharacterPage() {
  const { slug } = useParams();
  if (!isValidMoyassinChatSlug(slug)) {
    return <Navigate to="/moyassin" replace />;
  }
  const chatChar = getMoyassinChatCharacter(slug);
  if (!chatChar) {
    return <Navigate to="/moyassin" replace />;
  }

  const isBird = slug === "bird";
  const displayName = chatChar.name;
  const tagline = isBird ? MOYASSIN_BIRD.tagline : "الرياضيات أوضح… خطوة بخطوة.";
  const description = isBird ? MOYASSIN_BIRD.summaryAr : TEACHER_ROLE_AR;
  const tint = isBird ? "#7c3aed" : "#0284c7";
  const bgSoft = isBird
    ? "linear-gradient(165deg, rgba(124,58,237,0.12), rgba(15,23,42,0.92))"
    : "linear-gradient(165deg, rgba(2,132,199,0.14), rgba(15,23,42,0.92))";

  return (
    <div className="mys-char-page">
      <section
        className="mys-char-hero"
        style={{
          "--mys-char-tint": tint,
          background: bgSoft,
        }}
      >
        <div className="mys-char-hero-inner">
          <motion.div
            className="mys-char-hero-grid"
            variants={stagger(0.07)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="mys-char-hero-visual">
              <div className="mys-char-imgWrap">
                <img
                  src={chatChar.img}
                  alt={displayName}
                  draggable={false}
                  className={`mys-char-img${isBird ? "" : " mys-char-img--round"}`}
                />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="mys-char-hero-copy">
              <Link to="/moyassin" className="mys-char-back">
                → الرئيسية
              </Link>
              <span className="mys-char-eyebrow">شخصية مياثن</span>
              <h1 className="mys-char-title" style={{ color: "#f8fafc" }}>
                {displayName}
              </h1>
              <p className="mys-char-tagline" style={{ color: "rgba(226,232,240,0.95)" }}>
                {tagline}
              </p>
              <p className="mys-char-description" style={{ color: "rgba(148,163,184,0.95)" }}>
                {description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mys-char-chat-section">
        <div className="mys-char-chat-inner">
          <motion.header
            className="mys-char-chat-head"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: E.smooth }}
          >
            <h2 className="mys-char-chat-title" style={{ color: C.text }}>
              اختر طريقة التحدث مع {displayName}
            </h2>
            <p className="mys-char-chat-lead" style={{ color: C.muted }}>
              {chatChar.videoCall
                ? "نص وصوت وفيديو — نفس تجربة التحدث مع شخصية حية."
                : "نص وصوت."}
            </p>
          </motion.header>

          <div className="mys-char-chat-modes">
            {CHAT_MODES.filter((mode) => mode !== "video" || chatChar.videoCall).map((mode, index) => {
              const meta = CHAT_LABELS[mode];
              return (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.42, ease: E.smooth }}
                >
                  <Link
                    to={`/moyassin/characters/${slug}/chat/${mode}`}
                    className="mys-char-chat-card"
                    style={{ "--mys-card-tint": tint }}
                  >
                    <span className="mys-char-chat-card-ico" aria-hidden>
                      {meta.icon}
                    </span>
                    <span className="mys-char-chat-card-title">{meta.title}</span>
                    <span className="mys-char-chat-card-desc">{meta.desc}</span>
                    <span className="mys-char-chat-card-go">ابدأ ←</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
