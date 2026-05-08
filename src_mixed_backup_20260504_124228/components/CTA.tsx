import { useLanguage } from "./LanguageProvider";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="section-shell cta-section" id="contact">
      <div className="cta-copy reveal">
        <h2>{t.cta.title}</h2>
        <p>{t.cta.text}</p>
      </div>
      <button className="primary-button reveal reveal-delay-1" type="button">
        {t.cta.button}
      </button>
    </section>
  );
}
