import { useLanguage } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="section-shell footer-inner">
        <div>
          <a className="brand-mark" href="#home" aria-label="Sincero Consulting home">
            <span className="brand-symbol">S</span>
            <span>Sincero Consulting</span>
          </a>
          <p>{t.footer.tagline}</p>
        </div>
        <nav aria-label="Footer navigation">
          {t.footer.links.map((link) => (
            <a href={link === "Contacto" || link === "Contact" ? "#contact" : "#solution"} key={link}>
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
