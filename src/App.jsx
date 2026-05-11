import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useOutlet,
  NavLink,
  Link,
  Navigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { C, E } from "./theme";
import "./App.css";

import HomePage from "./pages/HomePage";
import EcoClubPage from "./pages/EcoClubPage";
import EcoFriendsPage from "./pages/EcoFriendsPage";
import ActionWallPage from "./pages/ActionWallPage";
import AboutPage from "./pages/AboutPage";
import TVPage from "./pages/TVPage";
import StudentsPage from "./pages/StudentsPage";
import CharacterPage from "./pages/CharacterPage";
import CharacterChatPage from "./pages/CharacterChatPage";

const NAV = [
  { path: "/", label: "الرئيسية" },
  { path: "/eco-club", label: "🌿 النادي" },
  { path: "/students", label: "أعضاء النادي" },
  { path: "/eco-friends", label: "الأصدقاء" },
  { path: "/action-wall", label: "جدار الفعل" },
  { path: "/about", label: "عن المدرسة" },
  { path: "/tv", label: "📺 TV" },
];

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: E.smooth }}
        style={{ minHeight: "calc(100vh - 68px)" }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div
      dir="rtl"
      style={{
        background: C.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {menuOpen ? (
        <button
          type="button"
          className="nav-menu-backdrop"
          aria-label="إغلاق القائمة"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <nav className={`nav-bar${menuOpen ? " nav-bar--menu-open" : ""}`}>
        <Link
          to="/"
          className="nav-brand"
          onClick={() => setMenuOpen(false)}
        >
          <div className="nav-brand-mark">✦</div>
          <div>
            <div className="nav-brand-name">الانطلاقة</div>
            <div
              style={{
                fontSize: 10.5,
                color: C.muted,
                fontWeight: 600,
                letterSpacing: 2,
              }}
            >
              ECO · SCHOOL
            </div>
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
              end={n.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                "nav-btn" + (isActive ? " is-active" : "")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main style={{ paddingTop: 68, flex: 1 }}>
        <AnimatedOutlet />
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
            <div className="nav-brand-mark" style={{ width: 38, height: 38 }}>
              ✦
            </div>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 17 }}>
              مدرسة الانطلاقة
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.85, maxWidth: 320 }}>
            نظام نادي البيئة الرقمي — حيث يتلاقى التعليم والمسؤولية تجاه
            الأرض في رحلة جميلة لأعضاء النادي.
          </p>
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
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="eco-club" element={<EcoClubPage />} />
          <Route path="eco-dashboard" element={<EcoClubPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="eco-missions" element={<Navigate to="/eco-club" replace />} />
          <Route path="eco-friends" element={<EcoFriendsPage />} />
          <Route path="action-wall" element={<ActionWallPage />} />
          <Route path="good-habits" element={<Navigate to="/eco-club" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="tv" element={<TVPage />} />
          <Route path="characters/:slug" element={<CharacterPage />} />
          <Route path="characters/:slug/chat/:mode" element={<CharacterChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
