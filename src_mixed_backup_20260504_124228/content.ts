export type Language = "es" | "en";

export const copy = {
  es: {
    nav: {
      home: "Home",
      solution: "Solucion",
      companies: "Empresas",
      contact: "Contacto",
      language: "EN",
      theme: "Cambiar tema",
    },
    hero: {
      eyebrow: "Consultoria aplicada a aprendizaje, IA y operacion",
      title: "Convierte documentos complejos en experiencias claras, visuales y medibles.",
      description:
        "Sincero Consulting transforma contenido disperso en sistemas utiles: extraccion de conceptos, planeacion instruccional, evaluacion y experiencias interactivas listas para mostrar al cliente.",
      cta: "Empieza ahora",
      metrics: [
        { value: "4x", label: "mas claridad en entregables" },
        { value: "72h", label: "para validar un primer flujo" },
        { value: "IA", label: "con criterio humano" },
      ],
    },
    pain: {
      eyebrow: "El problema",
      title: "La informacion ya existe. Lo dificil es convertirla en decisiones.",
      items: [
        {
          title: "Documentos que no accionan",
          text: "PDFs, manuales y presentaciones viven aislados, sin convertirse en aprendizaje ni evidencia de avance.",
        },
        {
          title: "Procesos poco visibles",
          text: "Los equipos trabajan con esfuerzo real, pero sin una vista clara de extraccion, planeacion, evaluacion y mejora.",
        },
        {
          title: "Experiencias genericas",
          text: "La tecnologia promete automatizar, pero rara vez se adapta al contexto, lenguaje y objetivos del cliente.",
        },
        {
          title: "Resultados dificiles de medir",
          text: "Sin indicadores utiles, el valor queda en percepciones en lugar de aprendizaje, adopcion y decisiones.",
        },
      ],
    },
    solution: {
      eyebrow: "La solucion",
      title: "Un sistema consultivo para transformar contenido en valor operativo.",
      description:
        "Combinamos analisis, personalizacion y medicion para que cada entrega sea clara, util y defendible ante equipos directivos.",
      columns: [
        {
          title: "Analysis",
          text: "Extraemos conceptos clave, estructura, evidencia y riesgos desde materiales reales.",
          points: ["Mapeo de informacion", "Diagnostico de brechas", "Sintesis accionable"],
        },
        {
          title: "Personalization",
          text: "Convertimos el contenido en rutas, actividades y formatos alineados al contexto del negocio.",
          points: ["Objetivos de aprendizaje", "Plan de clase", "Experiencias interactivas"],
        },
        {
          title: "Measurement",
          text: "Creamos evaluaciones, quizzes e indicadores para mejorar con datos y criterio.",
          points: ["Rubricas", "Quizzes", "Insights ejecutivos"],
        },
      ],
    },
    cta: {
      title: "Construye una experiencia que se sienta clara desde el primer minuto.",
      text: "Empezamos con un flujo pequeno, medible y presentable. Si funciona, lo escalamos con rigor.",
      button: "Empieza ahora",
    },
    proof: {
      eyebrow: "Confianza",
      title: "Equipos que necesitan claridad, velocidad y criterio.",
      logos: ["Norte Labs", "Altura Group", "Vector AI", "Linea Capital"],
      testimonials: [
        {
          quote:
            "Sincero nos ayudo a convertir material tecnico en una experiencia que el equipo si pudo usar y medir.",
          name: "Mariana Lopez",
          role: "Directora de Operaciones",
        },
        {
          quote:
            "El valor estuvo en la claridad: menos promesas abstractas y mas entregables listos para tomar decisiones.",
          name: "Daniel Reyes",
          role: "Head of Learning",
        },
      ],
    },
    footer: {
      tagline: "Consultoria moderna para aprendizaje, IA y sistemas claros.",
      links: ["Solucion", "Empresas", "Contacto"],
    },
  },
  en: {
    nav: {
      home: "Home",
      solution: "Solution",
      companies: "Companies",
      contact: "Contact",
      language: "ES",
      theme: "Toggle theme",
    },
    hero: {
      eyebrow: "Consulting for learning, AI, and operations",
      title: "Turn complex documents into clear, visual, measurable experiences.",
      description:
        "Sincero Consulting transforms scattered content into useful systems: concept extraction, instructional planning, evaluation, and interactive experiences ready to show clients.",
      cta: "Start now",
      metrics: [
        { value: "4x", label: "clearer deliverables" },
        { value: "72h", label: "to validate a first flow" },
        { value: "AI", label: "with human judgment" },
      ],
    },
    pain: {
      eyebrow: "The problem",
      title: "The information already exists. The hard part is turning it into decisions.",
      items: [
        {
          title: "Documents that do not move",
          text: "PDFs, manuals, and decks stay isolated instead of becoming learning, evidence, and progress.",
        },
        {
          title: "Processes with low visibility",
          text: "Teams do real work, but lack a clear view of extraction, planning, evaluation, and improvement.",
        },
        {
          title: "Generic experiences",
          text: "Technology promises automation, but rarely adapts to the client's context, language, and goals.",
        },
        {
          title: "Hard-to-measure outcomes",
          text: "Without useful indicators, value remains perception instead of learning, adoption, and decisions.",
        },
      ],
    },
    solution: {
      eyebrow: "The solution",
      title: "A consultative system for turning content into operating value.",
      description:
        "We combine analysis, personalization, and measurement so every delivery is clear, useful, and defensible with leadership teams.",
      columns: [
        {
          title: "Analysis",
          text: "We extract key concepts, structure, evidence, and risks from real materials.",
          points: ["Information mapping", "Gap diagnosis", "Actionable synthesis"],
        },
        {
          title: "Personalization",
          text: "We convert content into paths, activities, and formats aligned to business context.",
          points: ["Learning objectives", "Lesson plans", "Interactive experiences"],
        },
        {
          title: "Measurement",
          text: "We create assessments, quizzes, and indicators to improve with data and judgment.",
          points: ["Rubrics", "Quizzes", "Executive insights"],
        },
      ],
    },
    cta: {
      title: "Build an experience that feels clear from the first minute.",
      text: "We start with a small, measurable, presentable flow. When it works, we scale it with rigor.",
      button: "Start now",
    },
    proof: {
      eyebrow: "Trust",
      title: "Teams that need clarity, speed, and judgment.",
      logos: ["Norte Labs", "Altura Group", "Vector AI", "Linea Capital"],
      testimonials: [
        {
          quote:
            "Sincero helped us turn technical material into an experience the team could actually use and measure.",
          name: "Mariana Lopez",
          role: "Operations Director",
        },
        {
          quote:
            "The value was clarity: fewer abstract promises and more deliverables ready for decisions.",
          name: "Daniel Reyes",
          role: "Head of Learning",
        },
      ],
    },
    footer: {
      tagline: "Modern consulting for learning, AI, and clear systems.",
      links: ["Solution", "Companies", "Contact"],
    },
  },
} as const;
