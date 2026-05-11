import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { C, fadeUp, stagger, popIn } from "../theme";

const HABITS_KEY = "intilaqa-eco-habits-v2";

const defaultHabits = [
  { id: "w", label: "أغلق الصنبور وأنا أغسل يديّ", emoji: "💧", color: "#0EA5E9" },
  { id: "l", label: "أطفئ الأنوار عند الخروج من الفصل", emoji: "💡", color: "#D97706" },
  { id: "p", label: "أستخدم حقيبتي القماشية بدل البلاستيك", emoji: "🛍️", color: "#16A34A" },
  { id: "r", label: "أفرّز النفايات في سلة التدوير", emoji: "♻️", color: "#22823F" },
  { id: "t", label: "أمشي قليلاً بدل السيارة عند الإمكان", emoji: "🚶", color: "#0369A1" },
  { id: "g", label: "أسقي نبتة في البيت أو المدرسة", emoji: "🌿", color: "#16A34A" },
  { id: "f", label: "أتجنّب هدر الطعام في صحني", emoji: "🍽️", color: "#D97706" },
  { id: "b", label: "أستخدم زجاجة قابلة لإعادة الاستخدام", emoji: "🥤", color: "#0EA5E9" },
];

export default function GoodHabitsPage() {
  const [doneToday, setDoneToday] = useState(() => {
    try {
      const raw = localStorage.getItem(HABITS_KEY);
      if (!raw) return {};
      const { day, map } = JSON.parse(raw);
      const today = new Date().toDateString();
      if (day !== today) return {};
      return map || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(HABITS_KEY, JSON.stringify({ day: today, map: doneToday }));
  }, [doneToday]);

  const toggle = (id) =>
    setDoneToday((prev) => ({ ...prev, [id]: !prev[id] }));

  const count = Object.values(doneToday).filter(Boolean).length;
  const pct = Math.round((count / defaultHabits.length) * 100);

  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 1280, margin: "0 auto" }}>
      <motion.div variants={stagger(0)} initial="hidden" animate="show" style={{ marginBottom: 36 }}>
        <motion.div variants={fadeUp} className="chip" style={{ marginBottom: 16 }}>
          ✦ ركن العادات الجميلة
        </motion.div>
        <motion.h1 variants={fadeUp} className="section-title" style={{ fontSize: "clamp(36px, 5vw, 52px)", marginBottom: 14 }}>
          عادةٌ يومية، <span className="text-grad-forest">عالمٌ أخضر</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="section-subtitle" style={{ marginBottom: 30 }}>
          عادات بسيطة — اضغط على البطاقة عندما تطبّقها اليوم. يُعاد التحديث كل صباح تلقائياً.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            padding: "16px 24px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDeep})`,
            color: "#fff",
            fontWeight: 700,
            boxShadow: `0 16px 40px ${C.primary}55`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "conic-gradient(#86EFAC " + pct + "%, rgba(255,255,255,0.18) 0)",
              display: "grid",
              placeItems: "center",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: C.primary,
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                color: "#fff",
              }}
            >
              {pct}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#86EFAC", letterSpacing: 2, fontWeight: 800 }}>
              ✦ اليوم
            </div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {count} / {defaultHabits.length} عادة منجزة
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={stagger(0)}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 18,
        }}
      >
        {defaultHabits.map((h) => {
          const on = !!doneToday[h.id];
          return (
            <motion.button
              key={h.id}
              type="button"
              onClick={() => toggle(h.id)}
              variants={popIn}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                position: "relative",
                textAlign: "right",
                padding: 28,
                borderRadius: 24,
                border: on
                  ? `2px solid ${h.color}`
                  : `1px solid ${C.border}`,
                background: on
                  ? `linear-gradient(135deg, #fff 0%, ${h.color}15 100%)`
                  : "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                direction: "rtl",
                boxShadow: on
                  ? `0 18px 44px ${h.color}33, 0 2px 6px ${h.color}22`
                  : "0 6px 18px rgba(31,41,55,0.05)",
                overflow: "hidden",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
            >
              {on && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: h.color,
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    fontWeight: 800,
                    boxShadow: `0 6px 14px ${h.color}66`,
                  }}
                >
                  ✓
                </motion.div>
              )}

              <motion.div
                animate={on ? { y: [0, -6, 0] } : {}}
                transition={{ duration: 1.6, repeat: on ? Infinity : 0, ease: "easeInOut" }}
                style={{
                  fontSize: 44,
                  marginBottom: 16,
                  filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.12))",
                }}
              >
                {h.emoji}
              </motion.div>
              <div
                style={{
                  fontWeight: 700,
                  color: C.text,
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {h.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: on ? h.color : C.muted,
                  letterSpacing: 1,
                }}
              >
                {on ? "✓ تم اليوم" : "اضغط إن أنجزتَها"}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
