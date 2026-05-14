import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { E, fadeUp, stagger } from "../theme";
import { tvChannels } from "../data/tvChannels";

/** Official school channel — open in new tab for subscribe & full library */
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@alintilaqa";

const channels = tvChannels;

/** Below `.tv-page__grid` desktop breakpoint in App.css — list sits under the player; scroll so the new clip is visible. */
const TV_PHONE_LAYOUT_MQ = "(max-width: 859px)";

/** Match App.jsx ScrollToTop. */
function scrollDocumentToTop() {
  const root = document.scrollingElement ?? document.documentElement;
  root.scrollTop = 0;
  root.scrollLeft = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    root.scrollTop = 0;
    root.scrollLeft = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function playlistTip(p) {
  if (p.type === "upload") {
    return "فيديو محلي — اضغط تشغيل ▶ على الشاشة؛ الصوت يعمل بعد تفاعلك مع المشغّل (خصوصاً على الجوال).";
  }
  if (p.type === "youtube" && p.live) {
    return "بث مباشر من يوتيوب — للصوت أوضح أو إن تعطل التضمين، افتح «فتح في يوتيوب».";
  }
  if (p.type === "youtube" && p.isShort) {
    return "شورت بإطار عمودي يناسب الجوال. للتحكم الكامل استخدم «فتح في يوتيوب».";
  }
  if (p.type === "youtube") {
    return "للتحكم الكامل بالصوت والجودة استخدم «فتح في يوتيوب».";
  }
  return "";
}

export default function TVPage() {
  const [active, setActive] = useState(0);
  const selectChannel = (i) => {
    setActive(i);
    if (typeof window !== "undefined" && window.matchMedia(TV_PHONE_LAYOUT_MQ).matches) {
      scrollDocumentToTop();
    }
  };
  const p = channels[active];
  const videoRef = useRef(null);
  const shortActive = p?.type === "youtube" && p?.isShort;

  /** Do not autoplay uploads: browsers often block sound until a user gesture; let native controls handle play + mute. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (p?.type !== "upload" || !p?.videoSrc) return;
    el.muted = false;
    el.volume = 1;
    el.currentTime = 0;
  }, [active, p?.type, p?.videoSrc]);

  return (
    <motion.div
      className="tv-page"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: E.smooth }}
    >
      <div className="tv-page__inner">
        <motion.header
          className="tv-page__header"
          variants={stagger(0)}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="tv-page__eyebrow">
            قناة المدرسة على يوتيوب
          </motion.div>
          <motion.h1 variants={fadeUp} className="tv-page__title">
            الانطلاقة <span className="tv-page__title-accent">TV</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="tv-page__lead">
            فيديوهات، شورتات، وبث موسيقى هادئ أثناء الدراسة — بعرض يناسب الجوال والكمبيوتر.
          </motion.p>
          <motion.div variants={fadeUp} className="tv-page__links">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-eco tv-page__link-btn"
            >
              قناة الانطلاقة
            </a>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-eco tv-page__link-btn tv-page__link-btn--ghost"
            >
              اشتراك
            </a>
          </motion.div>
        </motion.header>

        <div className={`tv-page__grid${shortActive ? " tv-page__grid--short" : ""}`}>
          <section className="tv-page__main" aria-label="المشغّل">
            <div
              className={`tv-page__player${shortActive ? " tv-page__player--short" : ""}`}
            >
              {p.type === "youtube" ? (
                <iframe
                  key={p.id}
                  className="tv-page__iframe"
                  src={`https://www.youtube.com/embed/${p.youtubeId}?rel=0`}
                  title={p.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : p.type === "upload" ? (
                <video
                  key={p.id}
                  ref={videoRef}
                  className="tv-page__video"
                  src={p.videoSrc}
                  controls
                  playsInline
                  preload="auto"
                />
              ) : null}
            </div>

            <div className="tv-page__meta">
              <div className="tv-page__badges">
                {p.live ? (
                  <span className="tv-page__badge tv-page__badge--live">
                    <span className="live-dot" aria-hidden />
                    مباشر
                  </span>
                ) : null}
                {p.type === "youtube" && p.isShort ? (
                  <span className="tv-page__badge tv-page__badge--short">شورت</span>
                ) : null}
                <span className="tv-page__badge tv-page__badge--muted">{p.time}</span>
              </div>
              <h2 className="tv-page__now-title">{p.title}</h2>
              <p className="tv-page__now-desc">{p.desc}</p>
              <div className="tv-page__actions">
                {p.type === "youtube" && p.watchUrl ? (
                  <a
                    href={p.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-eco tv-page__action"
                  >
                    فتح في يوتيوب
                  </a>
                ) : null}
              </div>
              <p className="tv-page__hint">{playlistTip(p)}</p>
            </div>
          </section>

          <aside className="tv-page__aside" aria-label="قائمة المحتوى">
            <h3 className="tv-page__aside-title">اختر مقطعاً</h3>
            <div className="tv-page__list">
              {channels.map((ch, i) => (
                <button
                  key={ch.id}
                  type="button"
                  className={`tv-page__list-item${active === i ? " is-active" : ""}`}
                  onClick={() => selectChannel(i)}
                >
                  <span className="tv-page__list-icon" aria-hidden>
                    {ch.icon}
                  </span>
                  <span className="tv-page__list-text">
                    <span className="tv-page__list-title">
                      {ch.title}
                      {ch.live ? <span className="live-dot tv-page__list-live" aria-hidden /> : null}
                    </span>
                    <span className="tv-page__list-meta">{ch.time}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
