import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { C, E, fadeUp, stagger } from "../theme";

import qatraImg from "../assets/characters/qatra.png";
import nadhifBoyImg from "../assets/characters/nadhif-boy.png";
import nadhifaGirlImg from "../assets/characters/nadhifa-girl.png";
import hummingbirdImg from "../assets/characters/hummingbird.png";
import shamouzaSunImg from "../assets/characters/shamouza-sun.png";

const MotionLink = motion.create(Link);

const fadeBlurUp = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: E.smooth },
  },
};

const springIn = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20, mass: 0.85 },
  },
};

const statPop = {
  hidden: { opacity: 0, y: 16, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

const closerStagger = stagger(0.1);

const riseSoft = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.68, ease: E.smooth },
  },
};

const HUB_BANDS = [
  {
    key: "media",
    title: "إعلام ومحتوى",
    links: [{ to: "/tv", label: "الانطلاقة TV", icon: "📺", hint: "فيديوهات وقصص من المدرسة" }],
  },
  {
    key: "club",
    title: "النادي والإنجاز",
    links: [
      { to: "/eco-club", label: "نادي البيئة", icon: "🌿", hint: "لوحة النشاط والمبادرات" },
      { to: "/students", label: "أعضاء النادي", icon: "👥", hint: "بطاقات الأعضاء والنقاط" },
      { to: "/action-wall", label: "جدار الفعل", icon: "✨", hint: "إنجازات الفصول" },
    ],
  },
  {
    key: "discover",
    title: "تعرّف أكثر",
    links: [
      { to: "/eco-friends", label: "أصدقاء البيئة", icon: "🦋", hint: "شخصيات المدرسة الخمس" },
      { to: "/about", label: "عن المدرسة", icon: "🏫", hint: "قيمنا ومسيرتنا" },
    ],
  },
];

/** Rhythm strip — values, not a second copy of the nav. */
const MARQUEE_ITEMS = ["شارك", "تعلّم", "اعتنِ", "أرضٌ تستحق العناية", "مجتمع صغير"];

function useHeroParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const px = (x - 0.5) * 2;
      const py = (y - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--hx", String(px));
        el.style.setProperty("--hy", String(py));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--hx", "0");
        el.style.setProperty("--hy", "0");
      });
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

function Mascot({ src, alt, style, floatDelay = 0, drift = 12, dur = 7.5, reduceMotion }) {
  const gentle = {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    rotate: 0,
  };
  const float = {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: [0, -drift, 0, drift * 0.6, 0],
    rotate: [0, 1.8, 0, -1.2, 0],
  };
  return (
    <motion.img
      src={src}
      alt={alt}
      draggable={false}
      className="mascot"
      initial={{ opacity: 0, y: 26, scale: 0.9, filter: "blur(10px)" }}
      animate={reduceMotion ? gentle : float}
      transition={
        reduceMotion
          ? { duration: 0.55, ease: E.smooth, delay: floatDelay * 0.5 }
          : {
              opacity: { duration: 0.7, ease: E.smooth, delay: floatDelay },
              scale: { duration: 0.7, ease: E.smooth, delay: floatDelay },
              filter: { duration: 0.7, ease: E.smooth, delay: floatDelay },
              y: { duration: dur, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
              rotate: { duration: dur, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
            }
      }
      style={style}
    />
  );
}

function FloatingAccent({ className, delay = 0, reduceMotion }) {
  if (reduceMotion) return null;
  return (
    <motion.span
      className={className}
      aria-hidden
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0.2, 0.45, 0.2],
        scale: [1, 1.15, 1],
        y: [0, -18, 0],
        x: [0, 10, 0],
      }}
      transition={{
        duration: 9 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useHeroParallax(heroRef);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const heroFade = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const artParallax = useTransform(scrollYProgress, [0, 1], [0, 72]);
  const blobDriftA = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const blobDriftB = useTransform(scrollYProgress, [0, 1], [0, 28]);

  /** ترتيب الشخصيات: نظيف، نظيفة، الطائر الطنان، شموسه، قطرة. */
  const schoolMascots = useMemo(
    () => [
      {
        key: "boy",
        slug: "nadhif",
        alt: "نظيف",
        src: nadhifBoyImg,
        scatterClass: "mascot-scatter--boy",
        tiltLayerStyle: {
          "--mascot-tilt": "5deg",
          "--mascot-parallax-x": "10px",
          "--mascot-parallax-y": "10px",
        },
        floatDelay: 0.06,
        drift: 10,
        dur: 7.6,
      },
      {
        key: "girl",
        slug: "nadhifa",
        alt: "نظيفة",
        src: nadhifaGirlImg,
        scatterClass: "mascot-scatter--girl",
        tiltLayerStyle: {
          "--mascot-tilt": "-4deg",
          "--mascot-parallax-x": "12px",
          "--mascot-parallax-y": "10px",
        },
        floatDelay: 0.1,
        drift: 9,
        dur: 7.1,
      },
      {
        key: "bird",
        slug: "hummingbird",
        alt: "الطائر الطنان",
        src: hummingbirdImg,
        scatterClass: "mascot-scatter--bird",
        tiltLayerStyle: {
          "--mascot-tilt": "5deg",
          "--mascot-parallax-x": "12px",
          "--mascot-parallax-y": "10px",
        },
        floatDelay: 0.14,
        drift: 12,
        dur: 9,
      },
      {
        key: "shamouza",
        slug: "shamouza",
        alt: "شموسه",
        src: shamouzaSunImg,
        scatterClass: "mascot-scatter--sun",
        tiltLayerStyle: {
          "--mascot-tilt": "-6deg",
          "--mascot-parallax-x": "12px",
          "--mascot-parallax-y": "10px",
        },
        floatDelay: 0.16,
        drift: 10,
        dur: 8.1,
      },
      {
        key: "qatra",
        slug: "qatra",
        alt: "قطرة",
        src: qatraImg,
        scatterClass: "mascot-scatter--qatra",
        tiltLayerStyle: {
          "--mascot-tilt": "8deg",
          "--mascot-parallax-x": "10px",
          "--mascot-parallax-y": "8px",
        },
        floatDelay: 0.18,
        drift: 10,
        dur: 7.8,
      },
    ],
    [],
  );

  const blobTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 22, repeat: Infinity, ease: "easeInOut" };

  return (
    <div className="page-root" dir="rtl">
      <section ref={heroRef} className="landing-hero">
        <div className="landing-hero-blobs" aria-hidden>
          <motion.div
            className="landing-blob landing-blob-a"
            style={{ y: blobDriftA }}
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.08, 1.02, 1],
                    opacity: [0.4, 0.52, 0.45, 0.4],
                  }
            }
            transition={blobTransition}
          />
          <motion.div
            className="landing-blob landing-blob-b"
            style={{ y: blobDriftB }}
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.06, 1.1, 1],
                    opacity: [0.38, 0.48, 0.42, 0.38],
                  }
            }
            transition={{ ...blobTransition, delay: 2 }}
          />
        </div>

        <div className="landing-floaties" aria-hidden>
          <FloatingAccent className="landing-float-dot landing-float-dot-1" delay={0} reduceMotion={reduceMotion} />
          <FloatingAccent className="landing-float-dot landing-float-dot-2" delay={1.2} reduceMotion={reduceMotion} />
          <FloatingAccent className="landing-float-dot landing-float-dot-3" delay={2.4} reduceMotion={reduceMotion} />
        </div>

        <div className="landing-hero-inner">
          <motion.div
            className="landing-copy"
            variants={stagger(0.06)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="hero-chip">
              <motion.span
                className="hero-chip-dot"
                aria-hidden
                animate={
                  reduceMotion
                    ? {}
                    : { scale: [1, 1.2, 1], opacity: [1, 0.75, 1] }
                }
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              مدرسة الانطلاقة الابتدائية
            </motion.div>

            <motion.div
              variants={stagger(0.14)}
              initial="hidden"
              animate="show"
              style={{ y: yTitle, opacity: heroFade }}
            >
              <motion.h1 className="landing-title" style={{ marginTop: 0, marginBottom: 0 }}>
                <motion.span variants={fadeBlurUp} style={{ display: "block" }}>
                  تعليمٌ <span className="text-grad-forest">يلهم</span>،
                </motion.span>
                <motion.span variants={fadeBlurUp} style={{ display: "block", marginTop: "0.12em" }}>
                  وتجربةٌ <span style={{ color: C.text }}>تستحق</span>.
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.p variants={fadeUp} className="landing-subtitle">
              مساحة رقمية للمرحلة الابتدائية: إعلام، نادي، إنجازات — بلغة بسيطة وبهجة تناسب الأطفال والمعلمين.
            </motion.p>

            <motion.div variants={fadeUp} className="landing-ctas">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/about" className="btn-eco">
                  تعرّف على المدرسة
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/tv" className="btn-outline-eco">
                  شاهد الانطلاقة TV ←
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger(0.08)}
              initial="hidden"
              animate="show"
              className="hero-stat-strip"
            >
              <motion.div variants={statPop} className="hero-stat">
                <div className="hero-stat-n">15+</div>
                <div className="hero-stat-l">سنة تأسيس</div>
              </motion.div>
              <div className="hero-stat-divider" aria-hidden />
              <motion.div variants={statPop} className="hero-stat">
                <div className="hero-stat-n">186</div>
                <div className="hero-stat-l">أعضاء نشطون</div>
              </motion.div>
              <div className="hero-stat-divider" aria-hidden />
              <motion.div variants={statPop} className="hero-stat">
                <div className="hero-stat-n">5</div>
                <div className="hero-stat-l">شخصيات تعليمية</div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="landing-art"
            style={{ y: reduceMotion ? 0 : artParallax }}
            aria-label="شخصيات أصدقاء البيئة — اضغط للدخول إلى صفحة كل شخصية"
          >
            <div className="landing-mascots landing-mascots--strip">
              {schoolMascots.map((m) => (
                <MotionLink
                  key={m.key}
                  to={`/characters/${m.slug}`}
                  className={`mascot-link mascot-strip-link ${m.scatterClass}`}
                  title={`صفحة ${m.alt}`}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                >
                  <span className="mascot-tilt-layer" style={m.tiltLayerStyle}>
                    <Mascot
                      src={m.src}
                      alt={m.alt}
                      floatDelay={m.floatDelay}
                      drift={m.drift}
                      dur={m.dur}
                      reduceMotion={reduceMotion}
                      style={{ left: 0, top: 0, width: "100%" }}
                    />
                  </span>
                </MotionLink>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-marquee" aria-label="تنقّل سريع بكلمات الموقع">
        <div className="landing-marquee-mask">
          <div
            className={`landing-marquee-track${reduceMotion ? " is-static" : ""}`}
            aria-hidden
          >
            <span className="landing-marquee-chunk">
              {MARQUEE_ITEMS.map((t) => (
                <span key={t} className="landing-marquee-item">
                  {t}
                </span>
              ))}
            </span>
            {!reduceMotion ? (
              <span className="landing-marquee-chunk" aria-hidden>
                {MARQUEE_ITEMS.map((t) => (
                  <span key={`${t}-b`} className="landing-marquee-item">
                    {t}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="landing-hub">
        <div className="landing-hub-inner">
          <motion.div
            className="section-head landing-hub-head"
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeBlurUp} className="section-eyebrow-clean">
              خريطة الموقع
            </motion.div>
            <motion.h2 variants={fadeBlurUp} className="section-title-clean">
              خريطة واحدة لكل <span className="text-grad-forest">أقسام المنصة</span>.
            </motion.h2>
            <motion.p variants={fadeUp} className="section-sub-clean">
              لا حاجة لحفظ عناوين كثيرة — اختر القسم الذي تريده من الأسفل.
            </motion.p>
          </motion.div>

          <div className="landing-hub-bands">
            {HUB_BANDS.map((band) => (
              <motion.div
                key={band.key}
                className="landing-hub-band"
                variants={riseSoft}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.12 }}
              >
                <div className="landing-hub-band-head">
                  <span className="landing-hub-band-line" aria-hidden />
                  <h3 className="landing-hub-band-title">{band.title}</h3>
                </div>
                <motion.div
                  className="landing-hub-pills"
                  variants={stagger(0.06)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  {band.links.map((l) => (
                    <MotionLink
                      key={l.to}
                      to={l.to}
                      className="landing-hub-pill"
                      variants={springIn}
                      whileHover={
                        reduceMotion
                          ? {}
                          : { y: -5, scale: 1.02, boxShadow: "0 20px 44px rgba(15, 77, 39, 0.12)" }
                      }
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="landing-hub-pill-ico" aria-hidden>
                        {l.icon}
                      </span>
                      <span className="landing-hub-pill-body">
                        <span className="landing-hub-pill-label">{l.label}</span>
                        <span className="landing-hub-pill-hint">{l.hint}</span>
                      </span>
                      <span className="landing-hub-pill-go" aria-hidden>
                        ←
                      </span>
                    </MotionLink>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-split">
        <motion.div
          className="landing-split-inner"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger(0.1)}
        >
          <motion.div variants={riseSoft} className="landing-split-panel landing-split-panel--tv">
            <div className="landing-split-eyebrow">إعلام</div>
            <h3 className="landing-split-title">
              قصصٌ من داخل <span className="text-grad-forest">المدرسة</span>
            </h3>
            <p className="landing-split-desc">
              فيديوهات قصيرة ولقطات من الفصل والملعب — لترى المدرسة كما هي، ببساطة وبفرح.
            </p>
            <motion.div
              className="landing-split-screen"
              whileHover={reduceMotion ? {} : { scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <iframe
                className="landing-split-screen-iframe"
                src="https://www.youtube.com/embed/1FG92SEv_TM?rel=0"
                title="قصص من داخل المدرسة — فيديو قصير"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ marginTop: 20 }}>
              <Link to="/tv" className="btn-eco">
                افتح قناة TV
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={riseSoft} className="landing-split-panel landing-split-panel--members">
            <div className="landing-split-eyebrow">المجتمع</div>
            <h3 className="landing-split-title">
              من يمشي على <span className="text-grad-forest">خطوة خضراء؟</span>
            </h3>
            <p className="landing-split-desc">
              صفحة الأعضاء تجمع البطاقات والنقاط — الشخصيات الخمس تظهر أعلاه في البطل؛ هنا نركّز على أسماء الأطفال الحقيقيين في النادي.
            </p>
            <ul className="landing-split-bullets" aria-label="ماذا تجد في صفحة الأعضاء">
              <li>بطاقة تعريف مختصرة لكل عضو</li>
              <li>لمحة عن مشاركاته البيئية</li>
            </ul>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ marginTop: 22 }}>
              <Link to="/students" className="btn-outline-eco">
                صفحة أعضاء النادي ←
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="landing-friends landing-friends--compact">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger(0.06)}
          className="landing-friends-inner landing-friends-inner--compact"
        >
          <motion.div variants={fadeBlurUp} className="section-eyebrow-clean">
            الشخصيات
          </motion.div>
          <motion.h2 variants={fadeBlurUp} className="section-title-clean friends-compact-title">
            أصدقاء البيئة — <span className="text-grad-forest">صفحة واحدة للتفاصيل</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="section-sub-clean friends-compact-lead">
            الشخصيات الخمس تظهر في أعلى الصفحة؛ اضغط أي وجه للدخول إلى صفحته. لمحة أوسع وروابط المحادثة تجدها في «أصدقاء البيئة» دون تكرار نفس الصور هنا.
          </motion.p>
          <motion.div variants={fadeUp} className="friends-compact-actions">
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block" }}>
              <Link to="/eco-friends" className="btn-eco">
                صفحة أصدقاء البيئة
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="landing-closer">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={closerStagger}
          className="landing-closer-inner"
        >
          <motion.div
            variants={fadeBlurUp}
            className="landing-closer-eyebrow"
          >
            رسالةُ المدرسة
          </motion.div>
          <motion.div variants={fadeBlurUp} className="landing-closer-text">
            الأرضُ ليست ميراثاً من آبائنا، بل أمانةٌ في أيدينا.
          </motion.div>
            <motion.div variants={fadeUp} className="landing-closer-ctas">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
              <Link to="/eco-club" className="btn-eco">
                انضم إلى الرحلة
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
              <Link to="/eco-friends" className="btn-outline-eco">
                قابل شخصيات النادي ←
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
