import { motion } from "framer-motion";
import { C, fadeUp, stagger } from "../theme";

const items = [
  { emoji: "🌳", text: "زرعنا العشرات من الأشجار", color: C.primary },
  { emoji: "🛠️", text: "نظمنا العديد من الورشات البيئية", color: C.primarySoft },
  { emoji: "📢", text: "صنعنا 20 صورة توعوية بيئية", color: C.accent },
  { emoji: "🎥", text: "أنتجنا 10 فيديوهات توعوية باستخدام الذكاء الاصطناعي", color: C.gold },
  { emoji: "♻️", text: "أعدنا تدوير عشرات المواد والأشياء المختلفة", color: C.primary },
  { emoji: "♻️", text: "حملة جمع البلاستيك لمدة أسبوع كامل", color: C.primarySoft },
  { emoji: "✂️", text: "ورشة إبداعية ممتعة في إعادة التدوير", color: C.accentDeep },
];

export default function ActionWallPage() {
  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 1080, margin: "0 auto" }}>
      <motion.div variants={stagger(0)} initial="hidden" animate="show" style={{ marginBottom: 44 }}>
        <motion.h1 variants={fadeUp} className="section-title" style={{ fontSize: "clamp(36px, 5vw, 52px)", marginBottom: 0 }}>
          جدار <span className="text-grad-forest">الفعل</span>
        </motion.h1>
      </motion.div>

      <div style={{ position: "relative", paddingInlineStart: 28 }}>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            insetInlineStart: 0,
            top: 8,
            width: 3,
            background: `linear-gradient(180deg, ${C.primary} 0%, ${C.accent} 100%)`,
            borderRadius: 999,
            opacity: 0.6,
          }}
        />
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.07, duration: 0.55 }}
            style={{ position: "relative", marginBottom: 20 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 + 0.2, type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "absolute",
                insetInlineStart: -36,
                top: 16,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: it.color,
                boxShadow: `0 0 0 4px ${C.bg}, 0 0 0 6px ${it.color}33`,
                zIndex: 1,
              }}
            />
            <motion.div
              whileHover={{ x: -6, scale: 1.01 }}
              className="card-hover"
              style={{ padding: 24, display: "flex", gap: 18, alignItems: "center" }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: `${it.color}15`,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 32,
                  flexShrink: 0,
                  border: `1.5px solid ${it.color}33`,
                }}
              >
                {it.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 16, lineHeight: 1.55 }}>{it.text}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
