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
import schoolLogoImg from "../assets/school-logo.png";

/** Warm the network cache for above-the-fold art (Vite resolves to final URLs in prod). */
const HERO_IMAGE_PRELOAD_HREFS = [
  nadhifBoyImg,
  nadhifaGirlImg,
  hummingbirdImg,
  shamouzaSunImg,
  qatraImg,
  schoolLogoImg,
];

const MotionLink = motion.create(Link);

/** Scroll / hero reveals with a slight scale “breath” for depth */
const revealScaleUp = {
  hidden: { opacity: 0, y: 44, scale: 0.93 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 76, damping: 18, mass: 0.85 },
  },
};

const revealScaleWide = {
  hidden: { opacity: 0, y: 36, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 68, damping: 17, mass: 0.9 },
  },
};

/** Hero headline sweep — no animated filter (much cheaper than blur on every frame). */
const fadeSweepFrom = (x = 0, extraY = 0) => ({
  hidden: { opacity: 0, y: 28 + extraY, x, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 88, damping: 18, mass: 0.82 },
  },
});

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

const riseFromSide = (x = 0) => ({
  hidden: { opacity: 0, y: 32, x, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 17, mass: 0.88 },
  },
});

/** Easier to satisfy than a tight ratio + negative root margin (avoids “stuck” hidden states on some viewports). */
const scrollViewport = {
  once: true,
  amount: 0.08,
  margin: "0px 0px 14% 0px",
};

/** Slightly earlier trigger so long school blocks feel alive sooner */
const scrollViewportSchool = {
  once: true,
  amount: 0.08,
  margin: "0px 0px 12% 0px",
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

function Mascot({
  src,
  alt,
  style,
  floatDelay = 0,
  drift = 12,
  dur = 7.5,
  reduceMotion,
  /** When the parent link runs the entrance, skip duplicate fade on the image */
  entranceHandledByParent = false,
  width,
  height,
  fetchPriority,
}) {
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
  const introHidden = { opacity: 0, y: 26, scale: 0.9, filter: "blur(10px)" };
  return (
    <motion.img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading="eager"
      fetchPriority={fetchPriority}
      draggable={false}
      className="mascot"
      initial={entranceHandledByParent ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : introHidden}
      animate={reduceMotion ? gentle : float}
      transition={
        reduceMotion
          ? { duration: 0.55, ease: E.smooth, delay: floatDelay * 0.5 }
          : {
              opacity: entranceHandledByParent
                ? { duration: 0 }
                : { duration: 0.7, ease: E.smooth, delay: floatDelay },
              scale: entranceHandledByParent
                ? { duration: 0 }
                : { duration: 0.7, ease: E.smooth, delay: floatDelay },
              filter: entranceHandledByParent
                ? { duration: 0 }
                : { duration: 0.7, ease: E.smooth, delay: floatDelay },
              y: { duration: dur, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
              rotate: { duration: dur, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
            }
      }
      style={style}
    />
  );
}

const SCHOOL_PILLARS = [
  {
    key: "earth",
    icon: "🌍",
    title: "أرضٌ نعتني بها",
    text: "نزرع عادات يومية تحترم الماء والتربة والهواء — في الفصل، في الملعب، وفي البيت.",
  },
  {
    key: "learn",
    icon: "📚",
    title: "تعليمٌ بهيج",
    text: "دروس وأنشطة بلغة بسيطة تناسب الطفل، تشجّع الفضول، وتربط المعرفة بالحياة.",
  },
  {
    key: "together",
    icon: "🤝",
    title: "مجتمعٌ يُبنى معاً",
    text: "معلّمون وأطفال وعائلات يشاركون قصة الانطلاقة — نادي بيئة، إعلام، وجدار فعل.",
  },
];

function LandingSchoolIntro({ reduceMotion }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.06"],
  });
  const orbAy = useTransform(scrollYProgress, [0, 1], [100, -85]);
  const orbBy = useTransform(scrollYProgress, [0, 1], [-55, 95]);
  const orbBx = useTransform(scrollYProgress, [0, 1], [-28, 36]);
  const panelLift = useTransform(scrollYProgress, [0, 0.5, 1], [38, 0, -28]);
  const logoTilt = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 4]);
  const shineX = useTransform(scrollYProgress, [0, 1], ["-20%", "55%"]);

  const introOrchestrate = reduceMotion
    ? stagger(0.05)
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: 0.04 },
        },
      };

  const introLogoV = reduceMotion
    ? fadeUp
    : {
        hidden: { opacity: 0, scale: 0.82, rotate: -7, y: 24 },
        show: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: 0,
          transition: { type: "spring", stiffness: 62, damping: 13 },
        },
      };

  const introCopyV = reduceMotion
    ? fadeUp
    : {
        hidden: { opacity: 0, y: 40, x: 28 },
        show: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { type: "spring", stiffness: 70, damping: 16, mass: 0.88 },
        },
      };

  return (
    <section ref={ref} className="landing-school landing-school--intro" aria-labelledby="landing-school-intro-heading">
      {!reduceMotion ? (
        <>
          <motion.div className="landing-school-orb landing-school-orb--a" style={{ y: orbAy }} aria-hidden />
          <motion.div
            className="landing-school-orb landing-school-orb--b"
            style={{ y: orbBy, x: orbBx }}
            aria-hidden
          />
          <motion.div className="landing-school-orb landing-school-orb--c" aria-hidden />
          <motion.div className="landing-school-shine" style={{ left: shineX }} aria-hidden />
        </>
      ) : null}

      <motion.div
        className="landing-school-intro-wrap"
        style={reduceMotion ? undefined : { y: panelLift }}
      >
        <motion.div
          className="landing-school-intro-grid"
          variants={introOrchestrate}
          initial="hidden"
          whileInView="show"
          viewport={scrollViewportSchool}
        >
          <motion.div variants={introLogoV} className="landing-school-logo-panel">
            <motion.div
              className="landing-school-logo-tilt"
              style={reduceMotion ? undefined : { rotate: logoTilt }}
              whileHover={reduceMotion ? {} : { scale: 1.04 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
            >
              <img
                src={schoolLogoImg}
                alt="شعار مدرسة الانطلاقة"
                className="landing-school-logo"
                width={943}
                height={960}
                decoding="async"
                loading="lazy"
              />
            </motion.div>
            <div className="landing-school-logo-glow" aria-hidden />
          </motion.div>

          <motion.div variants={introCopyV} className="landing-school-intro-copy">
            <div className="landing-school-eyebrow">عن المدرسة</div>
            <h2 id="landing-school-intro-heading" className="landing-school-title">
              مدرسة <span className="text-grad-forest">الانطلاقة</span> — مساحة للنمو والمسؤولية
            </h2>
            <p className="landing-school-lead">
              أول مدرسة إيكولوجية في تونس: تعليم ابتدائي يلتقي بالاهتمام بالأرض. معنا نادي البيئة ونادي الإعلامية،
              والانطلاقة TV وجدار الفعل — تجربة مدرسية حيّة ببساطة وبُهجة تناسب الأطفال والمعلّمين.
            </p>
            <div className="landing-school-intro-cta">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block" }}>
                <Link to="/about" className="btn-eco">
                  تعرّف على المدرسة بالتفصيل
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function LandingSchoolPillars({ reduceMotion }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.1"],
  });
  const railShift = useTransform(scrollYProgress, [0, 1], ["0% 50%", "24% 50%"]);
  const cardsY = useTransform(scrollYProgress, [0, 0.45, 1], [22, 0, -14]);

  const pillarOrchestrate = reduceMotion
    ? stagger(0.07)
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.14, delayChildren: 0.06 },
        },
      };

  const pillarCard = reduceMotion
    ? springIn
    : {
        hidden: { opacity: 0, y: 56, rotateX: -10, scale: 0.94 },
        show: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 68, damping: 15, mass: 0.9 },
        },
      };

  return (
    <section ref={ref} className="landing-school landing-school--pillars" aria-labelledby="landing-school-pillars-heading">
      {!reduceMotion ? (
        <motion.div className="landing-school-pillars-rail" style={{ backgroundPosition: railShift }} aria-hidden />
      ) : null}

      <motion.div
        className="landing-school-pillars-inner"
        style={reduceMotion ? undefined : { y: cardsY }}
      >
        <motion.div
          className="landing-school-pillars-head"
          variants={reduceMotion ? fadeUp : revealScaleWide}
          initial="hidden"
          whileInView="show"
          viewport={scrollViewportSchool}
        >
          <div className="landing-school-eyebrow landing-school-eyebrow--on-dark">روح المدرسة</div>
          <h2 id="landing-school-pillars-heading" className="landing-school-pillars-title">
            ثلاث ركائز <span className="text-grad-gold">نؤمن بها</span>
          </h2>
          <p className="landing-school-pillars-sub">
            كل ركن يكمّل الآخر: لا نفصل التعليم عن الأرض، ولا الأرض عن المجتمع الذي يحيط بالطفل.
          </p>
        </motion.div>

        <motion.div
          className="landing-school-pillars-grid"
          variants={pillarOrchestrate}
          initial="hidden"
          whileInView="show"
          viewport={scrollViewportSchool}
        >
          {SCHOOL_PILLARS.map((p) => (
            <motion.article
              key={p.key}
              variants={pillarCard}
              className="landing-school-pillar"
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      y: -8,
                      scale: 1.02,
                      boxShadow: "0 28px 56px rgba(11, 20, 17, 0.35), 0 0 0 1px rgba(134, 239, 172, 0.12)",
                    }
              }
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              <span className="landing-school-pillar-ico" aria-hidden>
                {p.icon}
              </span>
              <h3 className="landing-school-pillar-title">{p.title}</h3>
              <p className="landing-school-pillar-text">{p.text}</p>
              <span className="landing-school-pillar-corner" aria-hidden />
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function FloatingAccent({ className, delay = 0, reduceMotion }) {
  if (reduceMotion) return null;
  return (
    <motion.span
      className={className}
      aria-hidden
      initial={{ opacity: 0, scale: 0.45 }}
      animate={{
        opacity: [0, 0.22, 0.45, 0.22],
        scale: [0.45, 1, 1.15, 1],
        y: [8, 0, -18, 0],
        x: [0, 0, 10, 0],
      }}
      transition={{
        duration: 9 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.45 + delay * 0.06,
        times: [0, 0.12, 0.5, 1],
      }}
    />
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useHeroParallax(heroRef);

  useEffect(() => {
    const appended = [];
    for (const href of HERO_IMAGE_PRELOAD_HREFS) {
      const el = document.createElement("link");
      el.rel = "preload";
      el.as = "image";
      el.href = href;
      document.head.appendChild(el);
      appended.push(el);
    }
    return () => {
      for (const el of appended) el.remove();
    };
  }, []);

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
        width: 417,
        height: 598,
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
        width: 417,
        height: 598,
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
        width: 488,
        height: 511,
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
        width: 488,
        height: 511,
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
        width: 448,
        height: 558,
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

  const rmQuick = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.32, ease: E.smooth } },
  };

  const heroLead = {
    hidden: {},
    show: {
      transition: reduceMotion
        ? { staggerChildren: 0.05, delayChildren: 0 }
        : { staggerChildren: 0.11, delayChildren: 0.14 },
    },
  };

  const heroChipIntro = reduceMotion
    ? rmQuick
    : {
        hidden: { opacity: 0, y: -40, scale: 0.72, rotate: -6 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          transition: { type: "spring", stiffness: 200, damping: 15 },
        },
      };

  const lineSweepL = reduceMotion ? rmQuick : fadeSweepFrom(-58, 12);
  const lineSweepR = reduceMotion ? rmQuick : fadeSweepFrom(56, 8);

  const subtitleLift = reduceMotion
    ? rmQuick
    : {
        hidden: { opacity: 0, y: 52, scale: 0.9 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 95, damping: 17, mass: 0.82 },
        },
      };

  const ctaPop = reduceMotion
    ? rmQuick
    : {
        hidden: { opacity: 0, y: 40, scale: 0.86 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 125, damping: 16 },
        },
      };

  const statStripOrchestrate = reduceMotion
    ? { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
    : { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } };

  const statPopRm = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3, ease: E.smooth } },
  };

  const mascotStripReveal = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
      };

  const mascotPop = (i) =>
    reduceMotion
      ? rmQuick
      : {
          hidden: { opacity: 0, y: 44, scale: 0.32, rotate: i % 2 === 0 ? -18 : 18 },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: { type: "spring", stiffness: 290, damping: 19 },
          },
        };

  const friendsEyebrowTitle = reduceMotion ? rmQuick : revealScaleUp;

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
            variants={heroLead}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroChipIntro} className="hero-chip">
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

            <motion.h1
              className="landing-title"
              style={{ marginTop: 0, marginBottom: 0, y: yTitle, opacity: heroFade }}
              variants={{
                hidden: {},
                show: {
                  transition: reduceMotion
                    ? { staggerChildren: 0.04 }
                    : { staggerChildren: 0.16, delayChildren: 0 },
                },
              }}
            >
              <motion.span variants={lineSweepL} style={{ display: "block" }}>
                تعليمٌ <span className="text-grad-forest">يلهم</span>،
              </motion.span>
              <motion.span variants={lineSweepR} style={{ display: "block", marginTop: "0.12em" }}>
                وتجربةٌ <span style={{ color: C.text }}>تستحق</span>.
              </motion.span>
            </motion.h1>

            <motion.p variants={subtitleLift} className="landing-subtitle">
              مساحة رقمية للمرحلة الابتدائية: إعلام، نادي، إنجازات — بلغة بسيطة وبهجة تناسب الأطفال والمعلمين.
            </motion.p>

            <motion.div variants={ctaPop} className="landing-ctas">
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
              variants={statStripOrchestrate}
              initial="hidden"
              animate="show"
              className="hero-stat-strip"
            >
              <motion.div variants={reduceMotion ? statPopRm : statPop} className="hero-stat">
                <div className="hero-stat-n">15+</div>
                <div className="hero-stat-l">سنة تأسيس</div>
              </motion.div>
              <div className="hero-stat-divider" aria-hidden />
              <motion.div variants={reduceMotion ? statPopRm : statPop} className="hero-stat">
                <div className="hero-stat-n">186</div>
                <div className="hero-stat-l">أعضاء نشطون</div>
              </motion.div>
              <div className="hero-stat-divider" aria-hidden />
              <motion.div variants={reduceMotion ? statPopRm : statPop} className="hero-stat">
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
            <motion.div
              className="landing-mascots landing-mascots--strip"
              variants={mascotStripReveal}
              initial="hidden"
              animate="show"
            >
              {schoolMascots.map((m, i) => (
                <MotionLink
                  key={m.key}
                  to={`/characters/${m.slug}`}
                  className={`mascot-link mascot-strip-link ${m.scatterClass}`}
                  title={`صفحة ${m.alt}`}
                  variants={mascotPop(i)}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                >
                  <span className="mascot-tilt-layer" style={m.tiltLayerStyle}>
                    <Mascot
                      src={m.src}
                      alt={m.alt}
                      width={m.width}
                      height={m.height}
                      floatDelay={m.floatDelay}
                      drift={m.drift}
                      dur={m.dur}
                      reduceMotion={reduceMotion}
                      entranceHandledByParent={!reduceMotion}
                      fetchPriority={i === 0 ? "high" : i >= 3 ? "low" : undefined}
                      style={{ left: 0, top: 0, width: "100%" }}
                    />
                  </span>
                </MotionLink>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="landing-marquee"
        aria-label="تنقّل سريع بكلمات الموقع"
        variants={reduceMotion ? rmQuick : revealScaleWide}
        initial="hidden"
        whileInView="show"
        viewport={scrollViewport}
      >
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
      </motion.section>

      <LandingSchoolIntro reduceMotion={reduceMotion} />
      <LandingSchoolPillars reduceMotion={reduceMotion} />

      <section className="landing-hub" aria-label="خريطة الموقع">
        <div className="landing-hub-inner">
          <div className="landing-hub-bands">
            {HUB_BANDS.map((band) => (
              <motion.div
                key={band.key}
                className="landing-hub-band"
                variants={reduceMotion ? fadeUp : revealScaleUp}
                initial="hidden"
                whileInView="show"
                viewport={scrollViewport}
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
                  viewport={scrollViewport}
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
          viewport={scrollViewport}
          variants={stagger(0.1)}
        >
          <motion.div
            variants={reduceMotion ? fadeUp : riseFromSide(-52)}
            className="landing-split-panel landing-split-panel--tv"
          >
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
            <motion.div
              className="landing-split-cta"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: "inline-block" }}
            >
              <Link to="/tv" className="btn-eco">
                افتح قناة TV
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={reduceMotion ? fadeUp : riseFromSide(52)}
            className="landing-split-panel landing-split-panel--members"
          >
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
            <motion.div
              className="landing-split-cta"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: "inline-block" }}
            >
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
          viewport={scrollViewport}
          variants={stagger(0.06)}
          className="landing-friends-inner landing-friends-inner--compact"
        >
          <motion.div variants={friendsEyebrowTitle} className="section-eyebrow-clean">
            الشخصيات
          </motion.div>
          <motion.h2 variants={friendsEyebrowTitle} className="section-title-clean friends-compact-title">
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
    </div>
  );
}
