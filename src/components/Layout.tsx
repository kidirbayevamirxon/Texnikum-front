import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const navItem = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition ${isActive ? "text-white" : "text-white/70 hover:text-white"}`;

export default function Layout() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };
  return (
    <div className="ts-page">
      <div className="ts-bg">
        <div className="ts-glow-a" />
        <div className="ts-glow-b" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>
      <header className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="ts-shell flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl _bg-gradient-to-br from-emerald-400/80 to-cyan-400/80 _p-[1px]">
              <div className="h-full w-full rounded-xl bg-[#0b0f14] grid place-items-center">
                <span className="text-sm font-bold tracking-wide">QST</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold leading-4">
                Qo'ng'irat sanoat texnikumi №2
              </div>
              <div className="text-xs text-white/50">Portal</div>
            </div>
          </Link>
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
              Ta'minotlar
            </NavLink>
          </nav>
          <button onClick={handleLoginClick} className="ts-btn">
            Tizimga kirish
          </button>
        </div>
      </header>
      <main className="relative z-10">
        <div className="ts-shell pt-8 pb-14">
          <Outlet />
        </div>
      </main>
      <footer className="relative z-10 border-t border-white/10">
        <div className="ts-shell py-6 text-sm text-white/50 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Qo'ng'irat sanoat texnikumi №2</div>
          <div className="flex gap-4">
            <a className="hover:text-white transition" href="#">
              Aloqa
            </a>
            <a className="hover:text-white transition" href="#">
              Maxfiylik
            </a>
            <a className="hover:text-white transition" href="#">
              Yordam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
