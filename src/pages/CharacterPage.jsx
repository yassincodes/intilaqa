import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { C, E, fadeUp, stagger } from "../theme";
import { getCharacterBySlug, CHAT_MODES } from "../data/schoolCharacters";

const CHAT_LABELS = {
  text: { title: "محادثة نصية", desc: "اكتب أسئلتك وتلقَّ ردوداً من الشخصية.", icon: "💬" },
  voice: { title: "محادثة صوتية", desc: "تحدث بصوتك (يتطلب إذناً من المتصفح لاحقاً).", icon: "🎙️" },
  video: { title: "محادثة بالفيديو", desc: "تواصل مرئياً عند تفعيل الخدمة على المنصة.", icon: "📹" },
};

export default function CharacterPage() {
  const { slug } = useParams();
  const character = getCharacterBySlug(slug);

  if (!character) {
    return <Navigate to="/eco-friends" replace />;
  }

  return (
    <div className="character-page" dir="rtl">
      <section
        className="character-hero"
        style={{
          "--char-tint": character.tint,
          background: character.bgSoft,
        }}
      >
        <div className="character-hero-inner">
          <motion.div
            className="character-hero-grid"
            variants={stagger(0.07)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="character-hero-visual">
              <div className="character-hero-imgWrap">
                <img src={character.img} alt={character.name} draggable={false} className="character-hero-img" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="character-hero-copy">
              <Link to="/eco-friends" className="character-back">
                ← أصدقاء البيئة
              </Link>
              <span className="character-eyebrow">شخصية المدرسة</span>
              <h1 className="character-title" style={{ color: C.text }}>
                {character.name}
              </h1>
              <p className="character-tagline" style={{ color: C.primaryDeep }}>
                {character.tagline}
              </p>
              <p className="character-description" style={{ color: C.muted }}>
                {character.description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="character-chat-section">
        <div className="character-chat-inner">
          <motion.header
            className="character-chat-head"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: E.smooth }}
          >
            <h2 className="character-chat-title" style={{ color: C.text }}>
              اختر طريقة التحدث مع {character.name}
            </h2>
            <p className="character-chat-lead" style={{ color: C.muted }}>
              ثلاث قنوات — نص جاهز للتجربة، وصوت وفيديو جاهزة للربط لاحقاً مع خدمات المنصة.
            </p>
          </motion.header>

          <div className="character-chat-modes">
            {CHAT_MODES.map((mode, index) => {
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
                    to={`/characters/${character.slug}/chat/${mode}`}
                    className="character-chat-card"
                    style={{ "--card-tint": character.tint }}
                  >
                    <span className="character-chat-card-ico" aria-hidden>
                      {meta.icon}
                    </span>
                    <span className="character-chat-card-title">{meta.title}</span>
                    <span className="character-chat-card-desc">{meta.desc}</span>
                    <span className="character-chat-card-go">ابدأ ←</span>
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
