import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { C, E, fadeUp, stagger } from "../theme";
import { schoolCharactersInEcoFriendsOrder } from "../data/schoolCharacters";

export default function EcoFriendsPage() {
  const characters = schoolCharactersInEcoFriendsOrder();

  return (
    <div className="eco-friends-page" dir="rtl">
      <section className="eco-friends-hero">
        <div className="eco-friends-hero-glow eco-friends-hero-glow-a" aria-hidden />
        <div className="eco-friends-hero-glow eco-friends-hero-glow-b" aria-hidden />

        <div className="eco-friends-hero-inner">
          <motion.div
            className="eco-friends-hero-copy"
            variants={stagger(0.06)}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="chip eco-friends-hero-chip">
              شخصيات المدرسة
            </motion.div>
            <motion.h1 variants={fadeUp} className="eco-friends-title">
              أصدقاء <span className="text-grad-forest">البيئة</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="eco-friends-subtitle">
              خمس شخصيات بسيطة تقرّب فكرة العناية بالأرض: ماء، نظافة، طاقة، وتفاؤل.
            </motion.p>

            <motion.ul
              variants={fadeUp}
              className="eco-friends-hero-strip"
              aria-label="معاينة الشخصيات"
            >
              {characters.map((m, i) => (
                <motion.li
                  key={m.slug}
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, ease: E.smooth }}
                  className="eco-friends-hero-strip-item"
                  style={{ "--strip-tint": m.tint }}
                >
                  <Link to={`/characters/${m.slug}`} className="eco-friends-hero-strip-link" title={m.name}>
                    <img src={m.img} alt="" draggable={false} className="eco-friends-hero-strip-img" />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <section className="eco-friends-body">
        <div className="eco-friends-container">
          <motion.header
            className="eco-friends-section-head"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: E.smooth }}
          >
            <span className="eco-friends-section-eyebrow">تعرّف عليهم</span>
            <h2 className="eco-friends-section-title">الخمسة معاً في رحلةٍ خضراء</h2>
            <p className="eco-friends-section-lead">
              كل بطاقة فكرة واحدة واضحة — سهل تذكّرها داخل الفصل وخارجه.
            </p>
          </motion.header>

          <div className="eco-friends-grid">
            {characters.map((m, index) => (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: E.smooth }}
                whileHover={{ y: -6, transition: { duration: 0.22, ease: E.smooth } }}
              >
                <Link
                  to={`/characters/${m.slug}`}
                  className="eco-friends-card"
                  style={{
                    "--card-tint": m.tint,
                    background: m.bgSoft,
                  }}
                >
                  <div className="eco-friends-card-imgWrap">
                    <img src={m.img} alt={m.name} draggable={false} className="eco-friends-card-img" />
                  </div>
                  <h3 className="eco-friends-card-name" style={{ color: C.text }}>
                    {m.name}
                  </h3>
                  <p className="eco-friends-card-note" style={{ color: C.muted }}>
                    {m.tagline}
                  </p>
                  <span className="eco-friends-card-more">تعرّف وتحدث ←</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
