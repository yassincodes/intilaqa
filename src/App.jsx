import { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useOutlet,
  useParams,
  NavLink,
  Link,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { E } from "./theme";
import "./App.css";
import schoolLogo from "./assets/school-logo.png";

import HomePage from "./pages/HomePage";
import EcoClubPage from "./pages/EcoClubPage";
import EcoFriendsPage from "./pages/EcoFriendsPage";
import AboutPage from "./pages/AboutPage";
import TVPage from "./pages/TVPage";
import StudentsPage from "./pages/StudentsPage";
import StudentBadgePage from "./pages/StudentBadgePage";
import { getStudentBySlug, studentProfilePath } from "./data/students";
import CharacterPage from "./pages/CharacterPage";
import CharacterChatPage from "./pages/CharacterChatPage";
import MoyassinPage from "./pages/MoyassinPage";
import MoyassinLayout from "./moyassin/MoyassinLayout";
import MoyassinCharacterPage from "./moyassin/MoyassinCharacterPage";
import MoyassinChatPage from "./moyassin/MoyassinChatPage";

if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function LegacyStudentSlugRedirect() {
  const { slug } = useParams();
  const entry = slug ? getStudentBySlug(slug) : null;
  if (!entry) return <Navigate to="/students" replace />;
  return <Navigate to={studentProfilePath(entry.handle)} replace />;
}

const NAV = [
  { path: "/about", label: "المدرسة" },
  { path: "/eco-club", label: "نادي البيئة" },
  { path: "/students", label: "أعضاء النادي" },
  { path: "/eco-friends", label: "أصدقاء النادي" },
  { path: "/tv", label: "التلفزة" },
];

/** Reset document scroll on every client-side navigation (React Router keeps position by default). */
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    const scrollNow = () => {
      const root = document.scrollingElement ?? document.documentElement;
      root.scrollTop = 0;
      root.scrollLeft = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
    scrollNow();
    const id = requestAnimationFrame(scrollNow);
    return () => cancelAnimationFrame(id);
  }, [pathname, search]);

  return null;
}

function AnimatedOutlet({ navTopPad }) {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="app-outlet-frame"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: E.smooth }}
        style={{ minHeight: `calc(100svh - ${navTopPad}px)` }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const location = useLocation();

  const navTopPad = navCompact ? 76 : 100;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setNavCompact(window.scrollY > 36);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty("--app-nav-pad", `${navTopPad}px`);
    return () => {
      document.documentElement.style.removeProperty("--app-nav-pad");
    };
  }, [navTopPad]);

  // Page gradient lives on `html` (index.css --app-atmosphere). Shell stays transparent
  // so the nav frost + main sit on one continuous canvas.
  return (
    <div className="app-shell" dir="rtl">
      {menuOpen ? (
        <button
          type="button"
          className="nav-menu-backdrop"
          aria-label="إغلاق القائمة"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <nav
        className={`nav-bar${menuOpen ? " nav-bar--menu-open" : ""}${
          navCompact ? " nav-bar--compact" : ""
        }`}
      >
        <div className="nav-bar__scrim">
          <Link
            to="/"
            className="nav-brand"
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-brand-logo-wrap">
              <img
                src={schoolLogo}
                alt="شعار المدرسة الابتدائية النموذجية ببغار"
                className="nav-brand-logo"
                width={48}
                height={48}
                decoding="async"
              />
            </span>
            <div>
              <div className="nav-brand-name">الانطلاقة</div>
            </div>
          </Link>

          <button
            type="button"
            className="nav-btn nav-burger"
            aria-expanded={menuOpen}
            aria-controls="site-nav-links"
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕ إغلاق" : "☰ القائمة"}
          </button>

          <div className="nav-links" id="site-nav-links">
            {NAV.map((n) => (
              <NavLink
                key={n.path}
                to={n.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  "nav-btn" + (isActive ? " is-active" : "")
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-main" style={{ paddingTop: navTopPad }}>
        <AnimatedOutlet navTopPad={navTopPad} />
      </main>

      <footer className="footer">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span className="footer-brand-logo-wrap">
              <img
                src={schoolLogo}
                alt=""
                width={40}
                height={40}
                decoding="async"
              />
            </span>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 17 }}>
              مدرسة الانطلاقة
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.85, maxWidth: 320 }}>
            نظام نادي البيئة الرقمي — حيث يتلاقى التعليم والمسؤولية تجاه
            الأرض في رحلة جميلة لأعضاء النادي.
          </p>
          <h4 style={{ marginTop: 22 }}>تابعنا</h4>
          <a
            href="https://www.youtube.com/@alintilaqa"
            target="_blank"
            rel="noopener noreferrer"
          >
            يوتيوب — @alintilaqa
          </a>
          <a
            href="https://www.tiktok.com/@al_intilaqa"
            target="_blank"
            rel="noopener noreferrer"
          >
            تيك توك — @al_intilaqa
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61556200167642"
            target="_blank"
            rel="noopener noreferrer"
            title="المدرسة الابتدائية الانطلاقة غار الملح — فيسبوك"
          >
            فيسبوك — المدرسة الابتدائية الانطلاقة
          </a>
        </div>
        <div>
          <h4>روابط سريعة</h4>
          {NAV.slice(0, 5).map((n) => (
            <Link key={n.path} to={n.path}>
              {n.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>المزيد</h4>
          {NAV.slice(5).map((n) => (
            <Link key={n.path} to={n.path}>
              {n.label}
            </Link>
          ))}
          <div
            style={{
              marginTop: 22,
              fontSize: 11.5,
              color: "rgba(248,241,227,0.4)",
              fontWeight: 500,
            }}
          >
            © 2026 جميع الحقوق محفوظة
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Full-screen chat: no site nav or footer — dedicated speaking UI */}
        <Route path="characters/:slug/chat/:mode" element={<CharacterChatPage />} />
        {/* مياثن: مساحة وواجهة مستقلتان — بدون شريط مدرسة الانطلاقة */}
        <Route path="moyassin" element={<MoyassinLayout />}>
          <Route index element={<MoyassinPage />} />
          <Route path="characters/:slug" element={<MoyassinCharacterPage />} />
          <Route path="characters/:slug/chat/:mode" element={<MoyassinChatPage />} />
        </Route>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="eco-club" element={<EcoClubPage />} />
          <Route path="eco-dashboard" element={<EcoClubPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:slug" element={<LegacyStudentSlugRedirect />} />
          <Route path="eco-missions" element={<Navigate to="/eco-club" replace />} />
          <Route path="eco-friends" element={<EcoFriendsPage />} />
          <Route path="action-wall" element={<Navigate to="/" replace />} />
          <Route path="good-habits" element={<Navigate to="/eco-club" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="tv" element={<TVPage />} />
          <Route path="characters/:slug" element={<CharacterPage />} />
          <Route path=":handle" element={<StudentBadgePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
