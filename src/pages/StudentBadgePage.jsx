import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "../theme";
import { getStudentByHandle, getStudentProfile } from "../data/students";

export default function StudentBadgePage() {
  const { handle: handleSegment } = useParams();
  const entry =
    handleSegment && handleSegment.startsWith("@")
      ? getStudentByHandle(handleSegment.slice(1))
      : null;

  if (!entry) {
    return <Navigate to="/students" replace />;
  }

  const { emoji } = getStudentProfile(entry.name);

  return (
    <div dir="rtl" className="page-root student-profile-page student-profile-page--name-only">
      <motion.div
        className="student-profile-shell"
        variants={stagger(0.04)}
        initial="hidden"
        animate="show"
      >
        <motion.div className="student-profile-toolbar" variants={fadeUp}>
          <Link to="/students" className="student-profile-back">
            ← العودة لأعضاء النادي
          </Link>
          <span className="student-profile-toolbar-brand">نادي البيئة · الانطلاقة</span>
        </motion.div>

        <motion.header className="student-profile-hero student-profile-hero--name-only" variants={fadeUp}>
          <div className="student-profile-identity student-profile-identity--name-only">
            <div className="student-profile-avatar-ring">
              <div className="student-profile-avatar">
                <span className="student-profile-emoji">{emoji}</span>
              </div>
            </div>
            <h1 className="student-profile-name">{entry.name}</h1>
          </div>
        </motion.header>
      </motion.div>
    </div>
  );
}
