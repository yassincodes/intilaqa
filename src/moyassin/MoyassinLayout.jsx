import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MOYASSIN_SESSION_DATE_AR,
  MOYASSIN_STUDENT_NAME,
} from "../data/moyassinSessionMeta";

function isMoyassinIndexPath(pathname) {
  return pathname === "/moyassin" || pathname === "/moyassin/";
}

export default function MoyassinLayout() {
  const { pathname } = useLocation();
  const showSessionHeader = isMoyassinIndexPath(pathname);

  return (
    <div className="mys-app" dir="rtl">
      {showSessionHeader ? (
        <header className="mys-topbar mys-topbar--session">
          <Link to="/moyassin" className="mys-session-brand" title="الرئيسية">
            <span className="mys-session-chip">{MOYASSIN_SESSION_DATE_AR}</span>
            <span className="mys-session-name">{MOYASSIN_STUDENT_NAME}</span>
          </Link>
        </header>
      ) : null}
      <div className="mys-outlet">
        <Outlet />
      </div>
    </div>
  );
}
