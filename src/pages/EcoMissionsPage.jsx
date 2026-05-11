import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, fadeUp, stagger, popIn } from "../theme";

const initialMissions = [
  { t: "جمع 5 كيلو ورق للتدوير", pts: 50, done: false, icon: "📰", category: "تدوير" },
  { t: "ترشيد المياه أسبوعاً — تسجيل من المنزل", pts: 40, done: true, icon: "💧", category: "ماء" },
  { t: "زرع نبتة في الفناء", pts: 80, done: false, icon: "🌱", category: "زراعة" },
  { t: "عرض 3 دقائق عن الطاقة الشمسية", pts: 60, done: false, icon: "☀️", category: "طاقة" },
  { t: "حملة تنظيف الحي قبل العطلة", pts: 100, done: false, icon: "🧹", category: "نظافة" },
  { t: "ورشة عمل عن إعادة استعمال البلاستيك", pts: 70, done: false, icon: "♻️", category: "تدوير" },
];

export default function EcoMissionsPage() {
  const [state, setState] = useState(initialMissions);
  const total = state.reduce((s, m) => s + (m.done ? m.pts : 0), 0);
  const target = state.reduce((s, m) => s + m.pts, 0);

  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 1080, margin: "0 auto" }}>
      <motion.div
        variants={stagger(0)}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 44 }}
      >
        <motion.div variants={fadeUp} className="chip chip-gold" style={{ marginBottom: 16 }}>
          🎯 المهام البيئية
        </motion.div>
        <motion.h1 variants={fadeUp} className="section-title" style={{ fontSize: "clamp(36px, 5vw, 52px)", marginBottom: 14 }}>
          اختَر مهمتك <span className="text-grad-forest">القادمة</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="section-subtitle">
          اختَر مهمة، أنجِزها مع فصلك، واكسب النقاط الخضراء.
        </motion.p>
      </motion.div>

      {/* Progress card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDeep})`,
          borderRadius: 24,
          padding: "26px 30px",
          marginBottom: 36,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
          boxShadow: `0 24px 60px ${C.primary}55`,
        }}
      >
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: 12, color: "#86EFAC", letterSpacing: 2, fontWeight: 800, marginBottom: 6 }}>
            ✦ تقدّمك الإجمالي
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {total} <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>/ {target} نقطة</span>
          </div>
        </div>
        <div style={{ flex: "2 1 360px", minWidth: 240 }}>
          <div className="prog-bar" style={{ background: "rgba(255,255,255,0.18)" }}>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${(total / target) * 100}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(90deg, #FBBF24, #FEF3C7)`,
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger(0)}
        initial="hidden"
        animate="show"
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <AnimatePresence>
          {state.map((m, i) => (
            <motion.div
              key={m.t}
              variants={popIn}
              layout
              whileHover={{ x: -4 }}
              className="card-hover"
              style={{
                padding: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                flexWrap: "wrap",
                borderRight: m.done ? `4px solid ${C.primary}` : `4px solid ${C.borderSoft}`,
                background: m.done ? `linear-gradient(90deg, ${C.bgAlt}, #fff)` : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: m.done ? C.primary : C.bgAlt,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 26,
                    flexShrink: 0,
                    boxShadow: m.done ? `0 8px 22px ${C.primary}55` : "none",
                  }}
                >
                  {m.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: 6,
                      fontSize: 16,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.t}
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="chip chip-gold" style={{ padding: "3px 10px", fontSize: 11 }}>
                      +{m.pts} نقطة
                    </span>
                    <span style={{ fontSize: 12, color: C.muted }}>{m.category}</span>
                  </div>
                </div>
              </div>
              <motion.button
                type="button"
                className={m.done ? "btn-outline-eco" : "btn-eco"}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  setState((prev) =>
                    prev.map((x, j) => (j === i ? { ...x, done: !x.done } : x)),
                  )
                }
              >
                {m.done ? "✓ تم الإنجاز" : "تعليم كمكتمل"}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
