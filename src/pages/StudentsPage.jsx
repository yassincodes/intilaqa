import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { E, fadeUp, stagger } from "../theme";
import { STUDENTS, getStudentProfile, studentProfilePath } from "../data/students";

const popCard = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: E.smooth },
  },
};

export default function StudentsPage() {
  const students = useMemo(
    () =>
      STUDENTS.map(({ name, handle }) => ({
        name,
        handle,
        ...getStudentProfile(name),
      })),
    [],
  );

  const memberCount = students.length;

  return (
    <div dir="rtl" className="page-root students-page">
      <div className="students-page-bg" aria-hidden />
      <section className="students-hero">
        <div className="students-hero-blob students-hero-blob-a" aria-hidden />
        <div className="students-hero-blob students-hero-blob-b" aria-hidden />
        <div className="students-hero-grid" aria-hidden />

        <motion.div
          className="students-hero-inner"
          variants={stagger(0.07)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="students-hero-kicker">
            <span className="students-hero-kicker-dot" />
            نادي البيئة · الانطلاقة
          </motion.div>
          <motion.h1 variants={fadeUp} className="students-hero-title">
            <span className="students-hero-title-line">ملفّات</span>
            <span className="students-hero-title-accent">أعضاء النادي</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="students-hero-sub">
            بطاقات حيّة لكل عضو: ورود التقدير، المشاركات البيئية، والنقاط الخضراء — جاهزة
            لربطها لاحقاً ببيانات حقيقية من المدرسة.
          </motion.p>
          <motion.div variants={fadeUp} className="students-hero-metrics">
            <div className="students-metric">
              <span className="students-metric-value">{memberCount}</span>
              <span className="students-metric-label">عضواً في العرض</span>
            </div>
            <div className="students-metric-divider" />
            <div className="students-metric">
              <span className="students-metric-value">3</span>
              <span className="students-metric-label">مؤشرات لكل بطاقة</span>
            </div>
            <div className="students-metric-divider" />
            <div className="students-metric">
              <span className="students-metric-value eco">ECO</span>
              <span className="students-metric-label">لوحة النادي</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="students-grid-wrap"
        variants={stagger(0.03)}
        initial="hidden"
        animate="show"
      >
        <div className="students-grid">
          {students.map((s, idx) => (
            <Link
              key={`${s.handle}-${s.name}`}
              to={studentProfilePath(s.handle)}
              className="student-card-link"
              aria-label={`شارة ${s.name}`}
            >
              <motion.div
                className="student-card"
                variants={popCard}
                style={{
                  "--m-ring": s.accent.ring,
                  "--m-glow": s.accent.glow,
                  "--m-chip": s.accent.chip,
                }}
                whileHover={{ y: -10, transition: { duration: 0.35, ease: E.smooth } }}
              >
                <div className="student-card-shine" aria-hidden />
                <span className="student-card-index" aria-hidden>
                  {idx + 1}
                </span>
                <div className="student-card-top">
                  <div className="student-card-avatar" aria-hidden>
                    <span className="student-card-avatar-ring" />
                    <span className="student-card-emoji">{s.emoji}</span>
                  </div>
                  <h2 className="student-card-name">{s.name}</h2>
                  <p className="student-card-tag">عضو نادي بيئة</p>
                </div>
                <ul className="student-card-stats">
                  <li className="student-stat student-stat--roses">
                    <span className="student-stat-icon" aria-hidden>
                      🌹
                    </span>
                    <span className="student-stat-meta">
                      <span className="student-stat-label">ورود التقدير</span>
                      <span className="student-stat-value">{s.roses}</span>
                    </span>
                  </li>
                  <li className="student-stat student-stat--missions">
                    <span className="student-stat-icon" aria-hidden>
                      ✨
                    </span>
                    <span className="student-stat-meta">
                      <span className="student-stat-label">مشاركات</span>
                      <span className="student-stat-value">{s.missions}</span>
                    </span>
                  </li>
                  <li className="student-stat student-stat--green">
                    <span className="student-stat-icon" aria-hidden>
                      🌿
                    </span>
                    <span className="student-stat-meta">
                      <span className="student-stat-label">نقاط خضراء</span>
                      <span className="student-stat-value">{s.greenPoints}</span>
                    </span>
                  </li>
                </ul>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
