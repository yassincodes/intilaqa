import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { E, fadeUp, stagger } from "../theme";
import {
  MOYASSIN_BIRD,
  TEACHER,
  TEACHER_ROLE_AR,
} from "../data/moyassinRoute";

export default function MoyassinPage() {
  return (
    <div className="moyassin-page mys-home" dir="rtl">
      <section className="moyassin-hero mys-home-hero">
        <div className="moyassin-hero-inner">
          <motion.div
            className="moyassin-hero-copy"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: E.smooth }}
          >
            <p className="moyassin-eyebrow mys-home-eyebrow" style={{ color: "rgba(148,163,184,0.95)" }}>
              عالم مستقل
            </p>
            <h1 className="moyassin-title mys-home-title" style={{ color: "#f1f5f9" }}>
              مياثن
            </h1>
            <p className="moyassin-lead mys-home-lead" style={{ color: "rgba(203,213,225,0.95)" }}>
              شخصيتان للحوار — نص وصوت وفيديو. لا صلة لهذا المسار بصفحات المدرسة.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="moyassin-characters mys-home-cards">
        <div className="moyassin-characters-inner">
          <motion.div
            className="moyassin-grid"
            variants={stagger(0.08)}
            initial="hidden"
            animate="show"
          >
            <motion.article
              variants={fadeUp}
              className="moyassin-card moyassin-card--bird mys-home-card"
              style={{ borderColor: "rgba(139,92,246,0.35)" }}
            >
              <div className="moyassin-card-visual">
                <img
                  src={MOYASSIN_BIRD.pic}
                  alt={MOYASSIN_BIRD.name}
                  draggable={false}
                  className="moyassin-card-img"
                />
              </div>
              <div className="moyassin-card-body">
                <h2 className="moyassin-card-title" style={{ color: "#f8fafc" }}>
                  {MOYASSIN_BIRD.name}
                </h2>
                <p className="moyassin-card-tagline" style={{ color: "#c4b5fd" }}>
                  {MOYASSIN_BIRD.tagline}
                </p>
                <p className="moyassin-card-text" style={{ color: "rgba(203,213,225,0.92)" }}>
                  {MOYASSIN_BIRD.summaryAr}
                </p>
                <details className="moyassin-prompt-block mys-prompt-block">
                  <summary>ملاحظات للبرومبت</summary>
                  <ul>
                    {MOYASSIN_BIRD.backstoryNotesForPrompt.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="moyassin-prompt-field">
                    <span className="moyassin-prompt-label">prompt:</span>{" "}
                    {MOYASSIN_BIRD.prompt || "— فارغ —"}
                  </p>
                </details>
                <Link to="/moyassin/characters/bird" className="mys-cta">
                  تعرّف وتحدّث ←
                </Link>
              </div>
            </motion.article>

            <motion.article
              variants={fadeUp}
              className="moyassin-card moyassin-card--teacher mys-home-card"
              style={{ borderColor: "rgba(14,165,233,0.4)" }}
            >
              <div className="moyassin-card-visual moyassin-card-visual--round">
                <img
                  src={TEACHER.pic}
                  alt={TEACHER.name}
                  draggable={false}
                  className="moyassin-card-img moyassin-card-img--teacher"
                />
              </div>
              <div className="moyassin-card-body">
                <h2 className="moyassin-card-title" style={{ color: "#f8fafc" }}>
                  {TEACHER.name}
                </h2>
                <p className="moyassin-card-text" style={{ color: "rgba(203,213,225,0.92)" }}>
                  {TEACHER_ROLE_AR}
                </p>
                <p className="moyassin-meta" style={{ color: "rgba(148,163,184,0.9)" }}>
                  اللغة: {TEACHER.language}
                </p>
                <details className="moyassin-prompt-block mys-prompt-block">
                  <summary>برومبت حسوب</summary>
                  <p className="moyassin-prompt-field">
                    <span className="moyassin-prompt-label">prompt:</span>{" "}
                    {TEACHER.prompt || "— فارغ —"}
                  </p>
                </details>
                <Link to="/moyassin/characters/teacher" className="mys-cta mys-cta--alt">
                  تعرّف وتحدّث ←
                </Link>
              </div>
            </motion.article>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
