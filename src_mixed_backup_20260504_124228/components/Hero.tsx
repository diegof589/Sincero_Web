import ParticleBackground from "./ParticleBackground";
import { useLanguage } from "./LanguageProvider";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero section-shell" id="home">
      <ParticleBackground />
      <div className="hero-grid">
        <div className="hero-copy reveal">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button">
              {t.hero.cta}
            </button>
          </div>
        </div>

        <div className="signal-panel reveal reveal-delay-1" aria-label="Sincero operating model">
          <div className="signal-header">
            <span>Pipeline</span>
            <strong>Live model</strong>
          </div>
          <div className="signal-graph">
            <span className="signal-dot signal-dot--one" />
            <span className="signal-dot signal-dot--two" />
            <span className="signal-dot signal-dot--three" />
            <span className="signal-dot signal-dot--four" />
            <span className="signal-line signal-line--one" />
            <span className="signal-line signal-line--two" />
            <span className="signal-line signal-line--three" />
          </div>
          <div className="signal-steps">
            <span>Extract</span>
            <span>Design</span>
            <span>Evaluate</span>
          </div>
        </div>
      </div>

      <div className="metric-strip reveal reveal-delay-2">
        {t.hero.metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
