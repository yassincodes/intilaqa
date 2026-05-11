import { motion } from "framer-motion";
import { C, stagger, popIn } from "../theme";

export default function AboutPage() {
  const values = [
    {
      icon: "🌱",
      title: "النمو المستدام",
      color: C.primary,
      bg: C.bgAlt,
      desc: "نربط التعلّم بالمسؤولية تجاه الأرض والمجتمع.",
    },
    {
      icon: "🤝",
      title: "الانتماء",
      color: C.accent,
      bg: "#E0F2FE",
      desc: "مدرستنا فضاء يشعر فيه كل طفل بالأمان والانتماء.",
    },
    {
      icon: "🎯",
      title: "التميّز",
      color: C.gold,
      bg: "#FEF3C7",
      desc: "نسعى للأفضل في التعليم والقيم والمشاركة البيئية.",
    },
    {
      icon: "🌍",
      title: "الانفتاح",
      color: C.primarySoft,
      bg: C.bgAlt,
      desc: "نُعدّ أجيالاً واعية بعالم متصل ومتغيّر.",
    },
  ];
  const timeline = [
    { y: "2009", t: "التأسيس", d: "انطلقت المدرسة بروح شبابية وطموح بلا سقف" },
    { y: "2013", t: "التوسّع", d: "مبانٍ ومختبرات تلائم العصر" },
    { y: "2018", t: "التميّز", d: "نتائج لافتة على الصعيد الجهوي" },
    { y: "2023", t: "الرقمنة", d: "منصة رقمية وقناة الانطلاقة TV" },
    { y: "2026", t: "نادي البيئة", d: "نظام رقمي متكامل للمدرسة الصديقة للبيئة" },
  ];

  return (
    <div dir="rtl" className="page-root" style={{ padding: "100px 5% 80px", maxWidth: 1280, margin: "0 auto" }}>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          background: `linear-gradient(135deg, ${C.ink} 0%, ${C.primaryDeep} 100%)`,
          borderRadius: 32,
          padding: "60px 5%",
          marginBottom: 64,
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 30px 80px ${C.primaryDeep}55`,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(217,119,6,0.25) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              color: "#86EFAC",
              fontWeight: 800,
              fontSize: 12,
              marginBottom: 16,
              letterSpacing: 4,
            }}
          >
            ✦ منذ 2009
          </div>
          <h1
            style={{
              fontSize: "clamp(36px,5.5vw,56px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 18,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            المدرسة الابتدائية <span style={{ color: "#86EFAC" }}>الانطلاقة</span>
          </h1>
          <p
            style={{
              color: "rgba(248,241,227,0.72)",
              maxWidth: 600,
              lineHeight: 1.9,
              fontSize: 16.5,
            }}
          >
            خمسة عشر عاماً ونحن ننسج حكايات النجاح. اليوم نضيف طبقة رقمية خضراء:
            نادٍ بيئي، وجدار فعل، وإعلام يعكس صوت أعضاء النادي.
          </p>
        </div>
      </motion.section>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title"
        style={{ fontSize: 30, marginBottom: 26 }}
      >
        قيمنا
      </motion.h2>
      <motion.div
        variants={stagger(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
          marginBottom: 64,
        }}
      >
        {values.map((v) => (
          <motion.div
            key={v.title}
            variants={popIn}
            whileHover={{ y: -6, scale: 1.02 }}
            className="card-hover"
            style={{ padding: 30 }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: v.bg,
                display: "grid",
                placeItems: "center",
                fontSize: 30,
                marginBottom: 18,
                boxShadow: `0 12px 24px ${v.color}33`,
              }}
            >
              {v.icon}
            </div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 19,
                color: C.text,
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {v.title}
            </h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>
              {v.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title"
        style={{ fontSize: 30, marginBottom: 32 }}
      >
        مسيرتنا
      </motion.h2>
      <div style={{ position: "relative", paddingInlineStart: 28, marginBottom: 32 }}>
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
          }}
        />
        {timeline.map((t, i) => (
          <motion.div
            key={t.y}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            style={{ position: "relative", marginBottom: 38, paddingInlineStart: 24 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 320, damping: 22 }}
              style={{
                position: "absolute",
                insetInlineStart: -33,
                top: 4,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background:
                  i === timeline.length - 1
                    ? `linear-gradient(135deg, ${C.gold}, ${C.goldSoft})`
                    : `linear-gradient(135deg, ${C.primary}, ${C.primaryDeep})`,
                boxShadow:
                  i === timeline.length - 1
                    ? `0 0 0 4px ${C.bg}, 0 0 0 6px ${C.gold}33`
                    : `0 0 0 4px ${C.bg}, 0 0 0 6px ${C.primary}33`,
              }}
            />
            <div
              style={{
                display: "inline-block",
                background: i === timeline.length - 1 ? C.gold : C.primary,
                color: "#fff",
                padding: "4px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 10,
                letterSpacing: 1,
              }}
            >
              {t.y}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 19, color: C.text, marginBottom: 6 }}>
              {t.t}
            </h3>
            <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.7 }}>{t.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
