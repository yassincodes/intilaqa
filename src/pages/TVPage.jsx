import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, E, fadeUp, stagger } from "../theme";

const EcoIslandScene = lazy(() => import("../EcoIslandScene"));

const channels = [
  {
    icon: "🌱",
    badge: "LIVE",
    title: "بث مباشر — الجزيرة الخضراء",
    time: "الآن",
    live: true,
    desc: "تجربة تلفزيونية ثلاثية الأبعاد لجزيرة الانطلاقة الخضراء العائمة في سحاب نوراني.",
  },
  {
    icon: "💧",
    title: "قِصَّةُ الْقَطْرَةِ: كَيْفَ عَلَّمَتْنَا قَطْرَةٌ صَغِيرَةٌ حِفْظَ الْمَاءِ",
    time: "فيديو",
    live: false,
    videoSrc:
      "https://res.cloudinary.com/dw45jvxmf/video/upload/v1778319397/Video_Project_13_qnaag8.mp4",
    desc: "قصة قصيرة ولطيفة تُذكّرنا أن كل قطرة مهمة — وكيف نُحافظ على الماء في حياتنا اليومية.",
  },
  {
    icon: "🚿",
    title: "نَصَائِحُ لِلْمُحَافَظَةِ عَلَى الْمَاءِ",
    time: "فيديو",
    live: false,
    videoSrc:
      "https://res.cloudinary.com/dw45jvxmf/video/upload/v1778318871/Video_Project_11_ozmfhz.mp4",
    desc: "نصائح عملية وسريعة لترشيد استهلاك الماء في المدرسة والبيت.",
  },
  {
    icon: "☀️",
    title: "صباح الانطلاقة",
    time: "08:00",
    live: false,
    desc: "أخبار المدرسة، فقرة فاصل أخضر، وكلمة اليوم عن ترشيد المياه.",
  },
  {
    icon: "🔬",
    title: "ركن العلوم الأخضر",
    time: "10:30",
    live: false,
    desc: "تجارب بسيطة عن الطاقة والتدوير لعيون الصغار والكبار.",
  },
  {
    icon: "📖",
    title: "حكايا وقصص",
    time: "14:00",
    live: false,
    desc: "قصص من التراث وحماية البيئة بين السطور.",
  },
  {
    icon: "🎨",
    title: "فن وإبداع",
    time: "11:00",
    live: false,
    desc: "معرض أعمال طلابية من مواد معاد تدويرها.",
  },
  {
    icon: "⚽",
    title: "رياضتنا",
    time: "15:30",
    live: false,
    desc: "ملخص الأسبوع الرياضي وأنشطة النادي البيئي في الملعب.",
  },
];

function FallbackScene() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(ellipse at center, #0d3b2a 0%, #07241a 50%, #02110b 100%)",
        color: "rgba(255,255,255,0.75)",
        fontWeight: 500,
        gap: 16,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.18)",
          borderTopColor: "#86efac",
          animation: "orbit-spin 0.9s linear infinite",
        }}
      />
      <span style={{ fontSize: 13, letterSpacing: 1.5 }}>تحميل المشهد ثلاثي الأبعاد…</span>
    </div>
  );
}

export default function TVPage() {
  const [active, setActive] = useState(0);
  const [power, setPower] = useState(true);
  const [muted, setMuted] = useState(false);
  const [showLeva, setShowLeva] = useState(false);
  const p = channels[active];
  const videoRef = useRef(null);
  const clock = new Date().toLocaleTimeString("ar-TN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!power) return;
    if (!p?.videoSrc) return;
    el.currentTime = 0;
    // Autoplay may be blocked; that's ok—user can hit play.
    el.play().catch(() => {});
  }, [active, power, p?.videoSrc]);

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: E.smooth }}
      style={{
        minHeight: "calc(100vh - 68px)",
        background:
          "radial-gradient(ellipse 130% 90% at 50% 5%, #142822 0%, #0a1714 45%, #050a08 100%)",
        padding: "44px 5% 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(94%, 880px)",
          height: 200,
          background:
            "radial-gradient(ellipse, rgba(34,197,94,0.28) 0%, rgba(14,165,233,0.18) 35%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-10%",
          width: 540,
          height: 540,
          background:
            "radial-gradient(circle, rgba(217,119,6,0.18) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Header ─── */}
      <motion.div
        variants={stagger(0)}
        initial="hidden"
        animate="show"
        style={{ textAlign: "center", marginBottom: 36, position: "relative", zIndex: 2 }}
      >
        <motion.div
          variants={fadeUp}
          className="chip"
          style={{
            background: "rgba(22,101,52,0.2)",
            color: "#86efac",
            borderColor: "rgba(134,239,172,0.3)",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
              animation: "blink-soft 1.4s ease-in-out infinite",
            }}
          />
          ECO · CINEMA · LIVE
        </motion.div>
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(34px, 5.5vw, 56px)",
            fontWeight: 800,
            color: "#f8f1e3",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: "0 4px 32px rgba(0,0,0,0.5)",
          }}
        >
          الانطلاقة <span style={{ color: "#86EFAC" }}>TV</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          style={{
            color: "rgba(248,241,227,0.55)",
            fontSize: 14.5,
            marginTop: 12,
            letterSpacing: 0.8,
            fontWeight: 500,
          }}
        >
          تجربة سينمائية ثلاثية الأبعاد · جزيرة بيئية عائمة في سحاب نوراني
        </motion.p>
      </motion.div>

      {/* ─── Layout ─── */}
      <div className="tv-stage-grid">
        {/* TV Unit ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: E.smooth }}
        >
          {/* Outer matte black bezel */}
          <div
            style={{
              position: "relative",
              padding: "18px 18px 26px",
              borderRadius: 24,
              background:
                "linear-gradient(180deg, #2a2f2e 0%, #181a19 35%, #0c0e0d 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.06), 0 60px 120px rgba(0,0,0,0.7), 0 8px 22px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* TV brand */}
            <div
              style={{
                textAlign: "center",
                fontSize: 9.5,
                fontWeight: 800,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.32)",
                marginBottom: 12,
                fontFamily: "Inter, sans-serif",
              }}
            >
              INTILAQA · ECO EDITION
            </div>

            {/* Inner deep bezel */}
            <div
              style={{
                borderRadius: 14,
                padding: 10,
                background: "linear-gradient(145deg, #0a0c0b, #030404)",
                boxShadow:
                  "inset 0 0 0 2px #000, inset 0 2px 10px rgba(255,255,255,0.04), inset 0 0 30px rgba(14,165,233,0.05)",
              }}
            >
              <div
                className="tv-frame-screen"
                style={{ background: "#020405" }}
              >
                <AnimatePresence mode="wait">
                  {!power ? (
                    <motion.div
                      key="off"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "#000",
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: 4,
                      }}
                    >
                      —— STAND BY ——
                    </motion.div>
                  ) : (
                    <motion.div
                      key="on"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      {p.videoSrc ? (
                        <video
                          ref={videoRef}
                          src={p.videoSrc}
                          controls
                          muted={muted}
                          playsInline
                          preload="metadata"
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            /* show the entire video without cropping */
                            objectFit: "contain",
                            background: "#000",
                          }}
                        />
                      ) : (
                        <Suspense fallback={<FallbackScene />}>
                          <EcoIslandScene showLeva={showLeva} />
                        </Suspense>
                      )}

                      {/* Channel HUD */}
                      <motion.div
                        key={active + "-hud"}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: "absolute",
                          top: 14,
                          left: 14,
                          right: 14,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          zIndex: 10,
                          pointerEvents: "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              background: "rgba(0,0,0,0.55)",
                              backdropFilter: "blur(6px)",
                              padding: "5px 12px",
                              borderRadius: 8,
                              fontSize: 11.5,
                              fontWeight: 800,
                              color: "rgba(255,255,255,0.92)",
                              letterSpacing: 1,
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            CH {String(active + 1).padStart(2, "0")}
                          </span>
                          {p.live && (
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span className="live-dot" />
                              <span
                                style={{
                                  color: "#fca5a5",
                                  fontWeight: 800,
                                  fontSize: 11.5,
                                  letterSpacing: 1,
                                }}
                              >
                                مباشر
                              </span>
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "rgba(255,255,255,0.75)",
                            fontVariantNumeric: "tabular-nums",
                            background: "rgba(0,0,0,0.4)",
                            padding: "5px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          {clock}
                        </div>
                      </motion.div>

                      {/* Bottom title overlay */}
                      <motion.div
                        key={active + "-title"}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: E.smooth }}
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                          padding: "44px 5% 22px",
                          zIndex: 9,
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "#86efac",
                            fontWeight: 700,
                            letterSpacing: 2,
                            marginBottom: 6,
                          }}
                        >
                          ✦ NOW PLAYING
                        </div>
                        <h2
                          style={{
                            fontSize: "clamp(18px, 2.6vw, 26px)",
                            fontWeight: 800,
                            color: "#fff",
                            marginBottom: 6,
                            textShadow: "0 4px 16px rgba(0,0,0,0.8)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {p.title}
                        </h2>
                        <p
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 13.5,
                            lineHeight: 1.7,
                            maxWidth: "92%",
                            fontWeight: 500,
                          }}
                        >
                          {p.desc}
                        </p>
                      </motion.div>

                      {/* Optical effects layered on top of canvas */}
                      <div className="tv-edge-glow" />
                      <div className="tv-vignette" />
                      <div className="tv-scanlines" />
                      <div className="tv-glare" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* TV bottom bar: power LED + speaker + brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 16,
                paddingInline: 8,
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setPower((v) => !v)}
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: power ? "#22c55e" : "#3a3f3d",
                    animation: power ? "led-pulse 2.2s ease-in-out infinite" : "none",
                    transition: "background 0.25s ease",
                  }}
                  title={power ? "إيقاف" : "تشغيل"}
                  aria-label="Power"
                />
                <span
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 800,
                    letterSpacing: 2,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  POWER
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 8,
                  background:
                    "repeating-linear-gradient(90deg, #1a1c1b 0px, #1a1c1b 3px, #0a0c0b 3px, #0a0c0b 6px)",
                  opacity: 0.85,
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
                }}
              />
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(134,239,172,0.6)",
                  fontWeight: 800,
                  letterSpacing: 2,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                4K · ECO · HDR
              </div>
            </div>
          </div>

          {/* TV stand */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: -2 }}>
            <div
              style={{
                width: "46%",
                height: 22,
                background: "linear-gradient(180deg, #2a2f2e, #141615)",
                borderRadius: "0 0 14px 14px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 56,
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: 90,
                height: 12,
                background: "linear-gradient(180deg,#2d3230,#181a19)",
                borderRadius: 6,
                boxShadow: "0 8px 14px rgba(0,0,0,0.5)",
              }}
            />
            <div
              style={{
                width: 90,
                height: 12,
                background: "linear-gradient(180deg,#2d3230,#181a19)",
                borderRadius: 6,
                boxShadow: "0 8px 14px rgba(0,0,0,0.5)",
              }}
            />
          </div>

          {/* Action row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 30,
              flexWrap: "wrap",
            }}
          >
            <motion.button
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              type="button"
              className="btn-eco"
              style={{ flex: "1 1 160px" }}
              onClick={() => setPower(true)}
            >
              ▶ مشاهدة
            </motion.button>
            <motion.button
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="btn-outline-eco"
              style={{
                flex: "1 1 140px",
                color: "#fff",
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? "🔇 صامت" : "🔊 صوت"}
            </motion.button>
            <motion.button
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className="btn-outline-eco"
              style={{
                flex: "1 1 140px",
                color: "#fef3c7",
                background: "rgba(217,119,6,0.12)",
                borderColor: "rgba(217,119,6,0.4)",
              }}
              onClick={() => setShowLeva((v) => !v)}
            >
              {showLeva ? "✨ إخفاء التحكم" : "🎛 لوحة المخرج"}
            </motion.button>
          </div>
        </motion.div>

        {/* Sidebar — channels + remote ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: E.smooth }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 900,
              color: "rgba(134,239,172,0.55)",
              letterSpacing: 3,
              marginBottom: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            ✦ جدول القنوات
          </div>
          <motion.div
            variants={stagger(0.05)}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}
          >
            {channels.map((pr, i) => (
              <motion.button
                key={i}
                type="button"
                variants={fadeUp}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(i)}
                className={`prog-row${active === i ? " is-on" : ""}`}
                style={{
                  textAlign: "right",
                  fontFamily: "inherit",
                  width: "100%",
                  background:
                    active === i
                      ? "linear-gradient(135deg, #22823f 0%, #166534 100%)"
                      : undefined,
                }}
              >
                <span style={{ fontSize: 22 }}>{pr.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: active === i ? "#fff" : "rgba(255,255,255,0.92)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {pr.title}
                    {pr.live && <span className="live-dot" />}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: active === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
                      marginTop: 2,
                      fontVariantNumeric: "tabular-nums",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {pr.time}
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Remote control */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              background:
                "linear-gradient(160deg, #2c3331 0%, #14181a 60%, #0a0d0c 100%)",
              borderRadius: 24,
              padding: 18,
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontSize: 9.5,
                color: "rgba(134,239,172,0.5)",
                marginBottom: 16,
                letterSpacing: 3,
                fontWeight: 800,
                fontFamily: "Inter, sans-serif",
              }}
            >
              ◆ INTILAQA · REMOTE
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {[
                { l: "CH+", a: () => setActive((i) => Math.min(channels.length - 1, i + 1)) },
                { l: "⏻", a: () => setPower((p) => !p) },
                { l: "CH-", a: () => setActive((i) => Math.max(0, i - 1)) },
              ].map((b, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  onClick={b.a}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    padding: "14px 0",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      idx === 1
                        ? `radial-gradient(circle at 50% 50%, ${C.primary}88, ${C.primaryDeep})`
                        : "rgba(0,0,0,0.4)",
                    color: idx === 1 ? "#fef3c7" : "rgba(255,255,255,0.9)",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: 14,
                    boxShadow:
                      idx === 1
                        ? "0 4px 14px rgba(22,101,52,0.45), inset 0 1px 0 rgba(255,255,255,0.1)"
                        : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  {b.l}
                </motion.button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { l: "🔊+", a: () => {} },
                { l: "🔊−", a: () => setMuted((m) => !m) },
                { l: "⭐", a: () => {} },
              ].map((b, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={b.a}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background:
                      i === 2
                        ? `linear-gradient(135deg, ${C.gold}55, ${C.goldSoft}33)`
                        : "rgba(0,0,0,0.3)",
                    color: i === 2 ? "#fef3c7" : "rgba(255,255,255,0.85)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {b.l}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tip card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: 22,
              background:
                "linear-gradient(135deg, rgba(22,101,52,0.32), rgba(14,165,233,0.18))",
              borderRadius: 18,
              padding: 18,
              border: "1px solid rgba(134,239,172,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                color: "#86efac",
                marginBottom: 8,
                letterSpacing: 0.5,
              }}
            >
              💡 هل تعلم؟
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(248,241,227,0.82)",
                lineHeight: 1.7,
              }}
            >
              المشهد ثلاثي الأبعاد تفاعلي — حرّك الفأرة برفق فوق التلفاز ليستجيب الكاميرا.
              كل شيء داخل الشاشة هو مشهد سينمائي حقيقي مُولَّد لحظياً.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
