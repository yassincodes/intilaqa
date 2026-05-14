import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AnimatedOutlet from "./AnimatedOutlet";

function NavItem({ to, children, onNavigate }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-btn${isActive ? " is-active" : ""}`}
      onClick={onNavigate}
    >
      {children}
    </NavLink>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useMemo(
    () => [
      { path: "/about", label: "المدرسة" },
      { path: "/eco-club", label: "نادي البيئة" },
      { path: "/students", label: "أعضاء النادي" },
      { path: "/eco-friends", label: "أصدقاء النادي" },
      { path: "/action-wall", label: "جدار الفعل" },
      { path: "/tv", label: "التلفزة" },
    ],
    [],
  );

  const onNavigate = () => setMenuOpen(false);

  return (
    <div className="page-root" dir="rtl">
      <nav className="nav-bar">
        <Link to="/" className="nav-brand" onClick={onNavigate}>
          <div className="nav-brand-mark">✦</div>
          <div className="nav-brand-name">الانطلاقة</div>
        </Link>

        <button
          type="button"
          className="nav-btn nav-burger"
          aria-label="القائمة"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰ القائمة"}
        </button>

        <div
          className="nav-links"
          style={{
            display: menuOpen ? "flex" : undefined,
          }}
        >
          {nav.map((n) => (
            <NavItem key={n.path} to={n.path} onNavigate={onNavigate}>
              {n.label}
            </NavItem>
          ))}
        </div>
      </nav>

      <main style={{ paddingTop: 68, flex: 1 }}>
        <AnimatedOutlet />
      </main>

      <footer className="footer">
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", marginBottom: 6 }}>
            مدرسة الانطلاقة — نظام النادي البيئي
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>© 2026 جميع الحقوق محفوظة</div>
        </div>
        <div>
          <h4>روابط</h4>
          {nav.slice(0, 5).map((n) => (
            <Link key={n.path} to={n.path}>
              {n.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>المدرسة</h4>
          <Link to="/about">من نحن</Link>
          <Link to="/eco-club">نادي البيئة</Link>
          <Link to="/tv">الانطلاقة TV</Link>
        </div>
      </footer>
    </div>
  );
}

