import { useCallback, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { E, fadeUp, stagger } from "../theme";
import {
  getStudentByHandle,
  getStudentBio,
  getStudentProfile,
  getStudentSkills,
  getStudentTimeline,
} from "../data/students";

const statItem = {
  hidden: { opacity: 0, y: 14 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.05, duration: 0.45, ease: E.smooth },
  }),
};

const cardReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: E.smooth },
  },
};

const postIn = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.06, duration: 0.4, ease: E.smooth },
  }),
};

export default function StudentBadgePage() {
  const { handle: handleSegment } = useParams();
  const entry =
    handleSegment && handleSegment.startsWith("@")
      ? getStudentByHandle(handleSegment.slice(1))
      : null;

  if (!entry) {
    return <Navigate to="/students" replace />;
  }

  const profile = getStudentProfile(entry.name);
  const { accent } = profile;
  const bio = getStudentBio(entry.name);
  const skills = getStudentSkills(entry.name);
  const timeline = getStudentTimeline(entry.name, entry.gender);

  const stats = [
    { icon: "🌹", label: "ورود التقدير", value: profile.roses },
    { icon: "✨", label: "مشاركات", value: profile.missions },
    { icon: "🌿", label: "نقاط خضراء", value: profile.greenPoints },
  ];

  const badgeCaptureRef = useRef(null);
  const [badgeDownloadBusy, setBadgeDownloadBusy] = useState(false);

  const downloadBadgePng = useCallback(async () => {
    const el = badgeCaptureRef.current;
    if (!el || !entry) return;
    setBadgeDownloadBusy(true);
    el.classList.add("student-badge-capturing");
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `eco-badge-${entry.handle}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      el.classList.remove("student-badge-capturing");
      setBadgeDownloadBusy(false);
    }
  }, [entry]);

  return (
    <div dir="rtl" className="page-root student-profile-page">
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

        <motion.header
          className="student-profile-hero"
          variants={fadeUp}
          style={{
            "--sp-accent": accent.ring,
            "--sp-glow": accent.glow,
            "--sp-chip": accent.chip,
          }}
        >
          <div className="student-profile-head-inner">
            <div className="student-profile-identity">
              <div className="student-profile-avatar-ring">
                <div className="student-profile-avatar">
                  <span className="student-profile-emoji">{profile.emoji}</span>
                </div>
              </div>
              <div className="student-profile-titles">
                <p className="student-profile-eco-chip">عضو معتمد · نادي البيئة</p>
                <h1 className="student-profile-name">{entry.name}</h1>
                <p className="student-profile-handle">
                  <span className="student-handle-ltr" translate="no">
                    @{entry.handle}
                  </span>
                </p>
                <p className="student-profile-bio">{bio}</p>
                <p className="student-profile-meta">مدرسة الانطلاقة · ملف يحدّثه فريق النادي</p>
              </div>
            </div>
            <ul className="student-profile-statstrip" aria-label="مؤشرات العضو">
              {stats.map((row) => (
                <li key={row.label} className="student-profile-statpill">
                  <span className="student-profile-statpill-ico" aria-hidden>
                    {row.icon}
                  </span>
                  <span className="student-profile-statpill-value">{row.value}</span>
                  <span className="student-profile-statpill-label">{row.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.header>

        <div className="student-profile-grid">
          <main className="student-profile-main">
            <motion.section className="student-feed" variants={fadeUp} aria-labelledby="feed-heading">
              <h2 id="feed-heading" className="student-feed-heading">
                <span aria-hidden>📸</span> النشاط
              </h2>
              <p className="student-feed-sub">منشورات يضيفها فريق النادي عن مشاركات الطالب.</p>

              <div className="student-feed-composer">
                <div className="student-feed-composer-avatar">{profile.emoji}</div>
                <div className="student-feed-composer-body">
                  <span className="student-feed-composer-placeholder">
                    هنا يكتب فريق نادي البيئة عن نشاطات {entry.name.split(/\s+/)[0]}…
                  </span>
                </div>
              </div>

              <ul className="student-feed-list">
                {timeline.map((post, i) => (
                  <motion.li
                    key={post.id}
                    className="student-feed-post"
                    variants={postIn}
                    custom={i}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="student-feed-post-head">
                      <div className="student-feed-post-avatar" aria-hidden>
                        🌿
                      </div>
                      <div className="student-feed-post-meta">
                        <span className="student-feed-post-author">نادي البيئة · الانطلاقة</span>
                        <span
                          className="student-feed-post-date"
                          dir="rtl"
                          translate="no"
                          aria-label={`${post.date.day} ${post.date.month} ${post.date.year}`}
                        >
                          <span className="student-date-num" dir="ltr">
                            {post.date.day}
                          </span>
                          <span className="student-date-month">{post.date.month}</span>
                          <span className="student-date-num" dir="ltr">
                            {post.date.year}
                          </span>
                        </span>
                      </div>
                    </div>
                    <p className="student-feed-post-body">
                      <span className="student-feed-post-icon" aria-hidden>
                        {post.icon}
                      </span>
                      {post.body}
                    </p>
                    <div className="student-feed-post-actions">
                      <span className="student-feed-reaction">🌿 معتمد</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          </main>

          <aside className="student-profile-sidebar">
            <motion.section className="student-profile-card student-profile-about" variants={fadeUp}>
              <h2 className="student-profile-card-title">نبذة</h2>
              <p className="student-profile-about-text">
                <strong className="student-profile-about-tag">{bio}</strong>
                <span className="student-profile-about-sep"> — </span>
                يحدّث فريق النادي هذا الملف وفق المشاركات داخل المدرسة.
              </p>
              <p className="student-profile-about-foot">الملف يعكس نشاط الطالب داخل نادي البيئة فقط.</p>
            </motion.section>

            <motion.section
              className="student-profile-card student-badge-skills"
              variants={fadeUp}
              aria-labelledby="student-skills-heading"
              style={{
                "--b-ring": accent.ring,
                "--b-chip": accent.chip,
              }}
            >
              <h2 id="student-skills-heading" className="student-badge-skills-title">
                <span className="student-badge-skills-title-ico" aria-hidden>
                  🌟
                </span>
                مهارات نادي البيئة
              </h2>
              <p className="student-badge-skills-hint">يحدّثها فريق النادي حسب المشاركات الفعلية.</p>
              <ul className="student-badge-skills-list">
                {skills.map((skill, i) => (
                  <motion.li
                    key={skill.key}
                    className="student-skill-row"
                    variants={statItem}
                    custom={i}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="student-skill-row-top">
                      <span className="student-skill-icon" aria-hidden>
                        {skill.icon}
                      </span>
                      <span className="student-skill-label">{skill.label}</span>
                      <span className="student-skill-pct">{skill.percent}%</span>
                    </div>
                    <div
                      className="student-skill-track"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={skill.percent}
                      aria-label={`${skill.label}: ${skill.percent} من 100`}
                    >
                      <motion.div
                        className="student-skill-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percent}%` }}
                        transition={{ delay: 0.25 + i * 0.06, duration: 0.75, ease: E.smooth }}
                      />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.section>

            <motion.div className="student-profile-badge-wrap" variants={cardReveal} initial="hidden" animate="show">
              <p className="student-profile-badge-label">شارة العضو المعتمد</p>
              <div ref={badgeCaptureRef} className="student-badge-capture-root">
                <motion.div
                  className="student-badge-card student-badge-card--embed"
                  style={{
                    "--b-ring": accent.ring,
                    "--b-glow": accent.glow,
                    "--b-chip": accent.chip,
                  }}
                >
                <div className="student-badge-card-glow" aria-hidden />
                <div className="student-badge-card-sheen" aria-hidden />
                <div className="student-badge-card-edge" aria-hidden />

                <div className="student-badge-shine" aria-hidden />

                <header className="student-badge-header student-badge-header--embed">
                  <p className="student-badge-kicker">
                    <span className="student-badge-kicker-line" />
                    شارة عضو معتمد
                    <span className="student-badge-kicker-line" />
                  </p>

                  <div className="student-badge-avatar-stage student-badge-avatar-stage--embed">
                    <div className="student-badge-avatar-halo" aria-hidden />
                    <div className="student-badge-avatar-orbit" aria-hidden />
                    <div className="student-badge-avatar-shell">
                      <div className="student-badge-avatar-wrap">
                        <span className="student-badge-avatar-ring" />
                        <span className="student-badge-emoji">{profile.emoji}</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="student-badge-name student-badge-name--embed">{entry.name}</h2>
                  <p className="student-badge-handle">
                    <span className="student-handle-ltr" translate="no">
                      @{entry.handle}
                    </span>
                  </p>
                  <p className="student-badge-role">عضو نادي بيئة · مدرسة الانطلاقة</p>
                </header>

                <footer className="student-badge-foot student-badge-foot--embed">
                  <div className="student-badge-seal">
                    <span className="student-badge-seal-ring" aria-hidden />
                    <span className="student-badge-seal-text">ECO</span>
                  </div>
                  <p className="student-badge-foot-wordmark">نادي البيئة · الانطلاقة</p>
                </footer>
                </motion.div>
              </div>
              <button
                type="button"
                className="student-badge-download-btn"
                onClick={downloadBadgePng}
                disabled={badgeDownloadBusy}
                aria-busy={badgeDownloadBusy}
              >
                {badgeDownloadBusy ? "جاري التحميل…" : "⬇️ تحميل الشارة كصورة عالية الجودة"}
              </button>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
