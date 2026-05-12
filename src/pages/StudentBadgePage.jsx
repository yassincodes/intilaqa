import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { E, fadeUp, stagger } from "../theme";
import { getStudentBySlug, getStudentProfile } from "../data/students";

const statItem = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.35 + i * 0.09, duration: 0.5, ease: E.smooth },
  }),
};

const cardReveal = {
  hidden: { opacity: 0, y: 36, scale: 0.94, rotateX: 8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.75, ease: E.smooth },
  },
};

export default function StudentBadgePage() {
  const { slug } = useParams();
  const entry = slug ? getStudentBySlug(slug) : null;

  if (!entry) {
    return <Navigate to="/students" replace />;
  }

  const profile = getStudentProfile(entry.name);
  const { accent } = profile;

  const stats = [
    { icon: "🌹", label: "ورود التقدير", value: profile.roses },
    { icon: "✨", label: "مشاركات", value: profile.missions },
    { icon: "🌿", label: "نقاط خضراء", value: profile.greenPoints },
  ];

  return (
    <div dir="rtl" className="page-root student-badge-page">
      <div className="student-badge-page-bg" aria-hidden />
      <div className="student-badge-page-mesh" aria-hidden />
      <div className="student-badge-page-grain" aria-hidden />
      <div className="student-badge-floaters" aria-hidden>
        <span className="student-badge-floater student-badge-floater--1" />
        <span className="student-badge-floater student-badge-floater--2" />
        <span className="student-badge-floater student-badge-floater--3" />
      </div>

      <motion.div
        className="student-badge-inner"
        variants={stagger(0.06)}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <Link to="/students" className="student-badge-back">
            العودة لأعضاء النادي
          </Link>
        </motion.div>

        <motion.div className="student-badge-stage" style={{ perspective: 1200 }} variants={fadeUp}>
          <motion.div
            variants={cardReveal}
            initial="hidden"
            animate="show"
            className="student-badge-card"
            style={{
              "--b-ring": accent.ring,
              "--b-glow": accent.glow,
              "--b-chip": accent.chip,
            }}
          >
            <div className="student-badge-card-glow" aria-hidden />
            <div className="student-badge-card-sheen" aria-hidden />
            <div className="student-badge-card-edge" aria-hidden />
            <span className="student-badge-corner student-badge-corner--tl" aria-hidden />
            <span className="student-badge-corner student-badge-corner--tr" aria-hidden />
            <span className="student-badge-corner student-badge-corner--bl" aria-hidden />
            <span className="student-badge-corner student-badge-corner--br" aria-hidden />

            <div className="student-badge-shine" aria-hidden />

            <header className="student-badge-header">
              <p className="student-badge-kicker">
                <span className="student-badge-kicker-line" />
                شارة عضو معتمد
                <span className="student-badge-kicker-line" />
              </p>

              <div className="student-badge-avatar-stage">
                <div className="student-badge-avatar-halo" aria-hidden />
                <div className="student-badge-avatar-orbit" aria-hidden />
                <div className="student-badge-avatar-shell">
                  <div className="student-badge-avatar-wrap">
                    <span className="student-badge-avatar-ring" />
                    <span className="student-badge-emoji">{profile.emoji}</span>
                  </div>
                </div>
              </div>

              <h1 className="student-badge-name">{entry.name}</h1>
              <p className="student-badge-role">عضو نادي بيئة · مدرسة الانطلاقة</p>
            </header>

            <ul className="student-badge-stats">
              {stats.map((row, i) => (
                <motion.li
                  key={row.label}
                  custom={i}
                  variants={statItem}
                  initial="hidden"
                  animate="show"
                  className="student-badge-stat"
                >
                  <span className="student-badge-stat-ico" aria-hidden>
                    {row.icon}
                  </span>
                  <span className="student-badge-stat-value">{row.value}</span>
                  <span className="student-badge-stat-label">{row.label}</span>
                </motion.li>
              ))}
            </ul>

            <footer className="student-badge-foot">
              <div className="student-badge-seal">
                <span className="student-badge-seal-ring" aria-hidden />
                <span className="student-badge-seal-text">ECO</span>
              </div>
              <p className="student-badge-foot-wordmark">نادي البيئة · الانطلاقة</p>
            </footer>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
