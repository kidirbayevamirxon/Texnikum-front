import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { hasToken } from "../utils/auth";
import { logout } from "../services/auth";

const navItem = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive ? "text-emerald-400" : "text-white/70 hover:text-white"
  }`;

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAdmin(hasToken());
  }, [location.pathname]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="ts-page min-h-screen flex flex-col">
      <div className="ts-bg">
        <div className="ts-glow-a" />
        <div className="ts-glow-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>

      <header className="relative z-30 border-b border-white/10 bg-black/40 backdrop-blur sticky top-0">
        <div className="ts-shell flex items-center justify-between py-3.5">
          <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-emerald-400/80 to-cyan-400/80 p-[1px]">
              <div className="h-full w-full rounded-xl bg-[#0b0f14] grid place-items-center">
                <span className="text-sm font-bold tracking-wide text-emerald-300">
                  QST
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold leading-4">
                Qo'ng'irot tumani 2-son texnikumi
              </div>
              <div className="text-xs text-white/50">Rasmiy portal</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navItem} end>
              Yangiliklar
            </NavLink>
            <NavLink to="/faculties" className={navItem}>
              Fakultetlar
            </NavLink>
            <NavLink to="/employees" className={navItem}>
              Xodimlar
            </NavLink>
            <NavLink to="/provisions" className={navItem}>
              Yutuqlar
            </NavLink>
          </nav>

          {/* Auth Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admin
                </span>
                <button
                  onClick={logout}
                  className="rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-500/25 transition"
                  title="Tizimdan chiqish"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ts-btn text-xs py-2 px-3 sm:px-4"
                onClick={closeMenu}
              >
                Tizimga kirish
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0b0f14]/95 backdrop-blur px-4 py-3 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 font-medium"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
              end
              onClick={closeMenu}
            >
              Yangiliklar
            </NavLink>
            <NavLink
              to="/faculties"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 font-medium"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
              onClick={closeMenu}
            >
              Fakultetlar
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 font-medium"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
              onClick={closeMenu}
            >
              Xodimlar
            </NavLink>
            <NavLink
              to="/provisions"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-xl text-sm ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 font-medium"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
              onClick={closeMenu}
            >
              Yutuqlar
            </NavLink>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        <div className="ts-shell pt-8 pb-14">
          <Outlet />
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="ts-shell py-6 text-sm text-white/50 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} Qo'ng'irot tumani 2-son texnikumi
          </div>
          <div className="flex gap-4">
            <span className="text-white/40">Ta'lim portali</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
