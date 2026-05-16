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
        emoji: getStudentProfile(name).emoji,
      })),
    [],
  );
  const memberCount = students.length;

  return (
    <div dir="rtl" className="page-root students-page">
      <div className="students-page-bg" aria-hidden />
      <section className="students-hero">
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
            <span className="students-hero-title-line">أعضاء</span>
            <span className="students-hero-title-accent">نادي البيئة</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="students-hero-sub">
            قائمة بأسماء الأعضاء — سنضيف التفاصيل لاحقاً عند توفّر البيانات.
          </motion.p>
          <motion.div variants={fadeUp} className="students-hero-metrics">
            <motion.div variants={fadeUp} className="students-metric">
              <span className="students-metric-value">{memberCount}</span>
              <span className="students-metric-label">عضواً</span>
            </motion.div>
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
          {students.map((s) => (
            <Link
              key={`${s.handle}-${s.name}`}
              to={studentProfilePath(s.handle)}
              className="student-card-link"
              aria-label={s.name}
            >
              <motion.div
                className="student-card student-card--name-only"
                variants={popCard}
                whileHover={{ y: -6, transition: { duration: 0.35, ease: E.smooth } }}
              >
                <div className="student-card-top">
                  <div className="student-card-avatar" aria-hidden>
                    <span className="student-card-avatar-ring" />
                    <span className="student-card-emoji">{s.emoji}</span>
                  </div>
                  <h2 className="student-card-name">{s.name}</h2>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
