import { useLanguage } from "./LanguageProvider";

export default function Solution() {
  const { t } = useLanguage();

  return (
    <section className="solution-band" id="solution">
      <div className="section-shell content-section">
        <div className="solution-heading reveal">
          <div>
            <p className="eyebrow">{t.solution.eyebrow}</p>
            <h2>{t.solution.title}</h2>
          </div>
          <p>{t.solution.description}</p>
        </div>

        <div className="solution-grid">
          {t.solution.columns.map((column, index) => (
            <article className="solution-column reveal" style={{ transitionDelay: `${index * 120}ms` }} key={column.title}>
              <span className="solution-number">{index + 1}</span>
              <h3>{column.title}</h3>
              <p>{column.text}</p>
              <ul>
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
