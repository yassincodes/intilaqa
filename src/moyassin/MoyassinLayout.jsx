import { Link, Outlet } from "react-router-dom";

export default function MoyassinLayout() {
  return (
    <div className="mys-app" dir="rtl">
      <header className="mys-topbar">
        <Link to="/moyassin" className="mys-brand" title="الصفحة الرئيسية لمياثن">
          <span className="mys-brand-glow" aria-hidden />
          <span className="mys-brand-text">مياثن</span>
        </Link>
        <span className="mys-topbar-note">مساحة مستقلة</span>
      </header>
      <div className="mys-outlet">
        <Outlet />
      </div>
    </div>
  );
}
