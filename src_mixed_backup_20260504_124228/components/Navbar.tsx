import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 20);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <a className="brand-mark" href="#home" aria-label="Sincero Consulting home">
        <span className="brand-symbol">S</span>
        <span>Sincero Consulting</span>
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#home">{t.nav.home}</a>
        <a href="#solution">{t.nav.solution}</a>
        <a href="#companies">{t.nav.companies}</a>
        <a href="#contact">{t.nav.contact}</a>
      </nav>

      <div className="nav-actions">
        <button className="toggle-button" type="button" onClick={toggleLanguage}>
          {t.nav.language}
        </button>
        <button
          className="icon-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={t.nav.theme}
          title={t.nav.theme}
        >
          <span className={`theme-glyph theme-glyph--${theme}`} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
