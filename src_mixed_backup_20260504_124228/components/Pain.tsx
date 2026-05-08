import { useLanguage } from "./LanguageProvider";

export default function Pain() {
  const { t } = useLanguage();

  return (
    <section className="section-shell content-section" id="pain">
      <div className="section-heading reveal">
        <p className="eyebrow">{t.pain.eyebrow}</p>
        <h2>{t.pain.title}</h2>
      </div>

      <div className="pain-grid">
        {t.pain.items.map((item, index) => (
          <article className="pain-card reveal" style={{ transitionDelay: `${index * 90}ms` }} key={item.title}>
            <span className="card-index">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
