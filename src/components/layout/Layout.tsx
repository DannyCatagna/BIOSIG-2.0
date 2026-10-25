import { Suspense, useEffect, useRef, useState } from "react";
import { Leaf, Menu, X, ArrowUpRight } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { academicPageTitle } from "../../data/academic";
import { navigation } from "../../data/navigation";

export function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    document.title = `${academicPageTitle(pathname) ?? navigation.find((item) => item.to === pathname)?.label ?? "Página no encontrada"} · BIOSIG 2.0`;
    if (previousPath.current !== pathname) {
      mainRef.current?.focus();
      window.scrollTo(0, 0);
      previousPath.current = pathname;
    }
  }, [pathname]);
  return (
    <>
      <a
        href="#contenido"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="BIOSIG 2.0, inicio"
            onClick={() => setOpen(false)}
          >
            <span className="brand-icon">
              <Leaf size={25} />
            </span>
            <span>
              BIOSIG<span className="brand-version">2.0</span>
              <small>APRENDER PARA CONSERVAR</small>
            </span>
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-navigation"
            aria-label="Navegación principal"
            className={open ? "navigation is-open" : "navigation"}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(false);
                document
                  .querySelector<HTMLButtonElement>(".menu-toggle")
                  ?.focus();
              }
            }}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
              >
                {item.label}
                {item.to === "/laboratorio-sig" && (
                  <ArrowUpRight size={15} aria-hidden="true" />
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} ref={mainRef}>
        <Suspense
          fallback={
            <p className="container page-content" role="status">
              Cargando lectura…
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="container academic-utilities footer-resources">
          <Link to="/referencias">Referencias</Link>
          <Link to="/revision-editorial">Revisión editorial</Link>
        </div>
        <div className="container footer-inner">
          <p>
            <strong>BIOSIG 2.0</strong>
            <span>
              Conocer el territorio. Comprender la vida. Aprender a cuidar.
            </span>
          </p>
          <p>
            Pedagogía de las Ciencias Experimentales
            <small>Química y Biología · Quinto semestre</small>
          </p>
        </div>
      </footer>
    </>
  );
}
