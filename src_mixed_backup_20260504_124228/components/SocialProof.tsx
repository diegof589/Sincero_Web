import { useLanguage } from "./LanguageProvider";

const logoSources = [
  "/assets/logo-norte.svg",
  "/assets/logo-altura.svg",
  "/assets/logo-vector.svg",
  "/assets/logo-linea.svg",
];

export default function SocialProof() {
  const { t } = useLanguage();

  return (
    <section className="section-shell content-section" id="companies">
      <div className="section-heading reveal">
        <p className="eyebrow">{t.proof.eyebrow}</p>
        <h2>{t.proof.title}</h2>
      </div>

      <div className="logo-row reveal reveal-delay-1">
        {t.proof.logos.map((label, index) => (
          <img src={logoSources[index]} alt={label} key={label} loading="lazy" />
        ))}
      </div>

      <div className="testimonial-grid">
        {t.proof.testimonials.map((item, index) => (
          <article className="testimonial-card reveal" style={{ transitionDelay: `${index * 120}ms` }} key={item.name}>
            <p>&quot;{item.quote}&quot;</p>
            <div>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
