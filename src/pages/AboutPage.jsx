import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { C, fadeUp, stagger } from "../theme";

const HIGHLIGHTS = [
  {
    icon: "🌿",
    title: "نادي البيئة",
    text: "مبادرات يومية ولوجة رقمية يتابع فيها الأعضاء نشاطهم ونقاطهم.",
    to: "/eco-club",
  },
  {
    icon: "📣",
    title: "نادي الإعلامية",
    text: "صوت المدرسة: قصص، لقاءات، ومحتوى يعبّر عن روح الانطلاقة.",
    to: "/tv",
  },
  {
    icon: "📺",
    title: "الانطلاقة TV",
    text: "فيديوهات قصيرة من الفصل والملعب — ببساطة وبفرح.",
    to: "/tv",
  },
];

export default function AboutPage() {
  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 720, margin: "0 auto" }}>
      <motion.div variants={stagger(0)} initial="hidden" animate="show" style={{ marginBottom: 40 }}>
        <motion.div variants={fadeUp} className="chip" style={{ marginBottom: 16 }}>
          🏫 من نحن
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="section-title"
          style={{ fontSize: "clamp(32px, 5vw, 48px)", marginBottom: 20, lineHeight: 1.2 }}
        >
          مدرسة <span className="text-grad-forest">الانطلاقة</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 17,
            lineHeight: 1.85,
            color: C.text,
            marginBottom: 14,
          }}
        >
          مدرسة الانطلاقة هي أول مدرسة إيكولوجية في تونس. نؤمن أن التعليم والاهتمام بالأرض يسيران معاً:
          فضاء ابتدائي يجمع بين البساطة والبهجة للأطفال والمعلّمين.
        </motion.p>
        <motion.p variants={fadeUp} style={{ fontSize: 16, lineHeight: 1.8, color: C.muted }}>
          معنا اليوم نادي البيئة ونادي الإعلامية، إلى جانب الانطلاقة TV — كلّها تكمّل بعضها
          لتجربة مدرسية حيّة ومسؤولة.
        </motion.p>
      </motion.div>

      <motion.ul
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}
      >
        {HIGHLIGHTS.map((item) => (
          <motion.li key={item.title} variants={fadeUp}>
            <Link
              to={item.to}
              className="card-hover"
              style={{
                display: "block",
                padding: "20px 22px",
                borderRadius: 18,
                textDecoration: "none",
                color: "inherit",
                border: `1px solid ${C.primary}22`,
                background: C.bgAlt,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ fontSize: 28, lineHeight: 1 }} aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{item.text}</div>
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ marginTop: 36 }}>
        <Link to="/eco-friends" className="btn-outline-eco" style={{ display: "inline-block" }}>
          تعرّف على أصدقاء البيئة ←
        </Link>
      </motion.div>
    </div>
  );
}
