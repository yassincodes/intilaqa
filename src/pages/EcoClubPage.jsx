import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { C, fadeUp, stagger, popIn } from "../theme";
import { getEcoClubDashboardStats } from "../data/students";

function formatCompactCount(n) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  const rounded = Math.round(k * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text}k`;
}

export default function EcoClubPage() {
  const stats = useMemo(() => {
    const s = getEcoClubDashboardStats();
    return [
      { n: String(s.activeMembers), l: "أعضاء نشطون في النادي", i: "👥", c: C.primary },
      { n: String(s.completedInitiatives), l: "مبادرة بيئية مكتملة", i: "✅", c: C.gold },
      { n: formatCompactCount(s.greenPoints), l: "نقطة خضراء للمدرسة", i: "⭐", c: C.accent },
      { n: String(s.symbolicTrees), l: "شجرة رمزية مزروعة", i: "🌳", c: C.primarySoft },
    ];
  }, []);

  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 1280, margin: "0 auto" }}>
      <motion.div
        variants={stagger(0)}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 56 }}
      >
        <motion.div variants={fadeUp} className="chip" style={{ marginBottom: 18 }}>
          🌿 لوحة النادي الرئيسية
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="section-title"
          style={{ fontSize: "clamp(40px, 6vw, 64px)", marginBottom: 14 }}
        >
          نادي البيئة — <span className="text-grad-forest">الانطلاقة</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="section-subtitle">
          نظرة على نشاط النادي والمبادرات البيئية في المدرسة.
        </motion.p>
      </motion.div>

      <motion.div
        variants={stagger(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 56,
        }}
      >
        {stats.map((s) => (
          <motion.div
            key={s.l}
            variants={popIn}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-hover"
            style={{ padding: 26, borderTop: `4px solid ${s.c}` }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.i}</div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: s.c,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {s.n}
            </div>
            <div style={{ fontSize: 13.5, color: C.muted, marginTop: 8, fontWeight: 500 }}>
              {s.l}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link to="/students" className="btn-eco">
          أعضاء النادي
        </Link>
      </div>
    </div>
  );
}
