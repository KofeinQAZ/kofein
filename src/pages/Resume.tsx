const experiences = [
  {
    period: "Июнь 2025 — н.в.",
    company: "ZhasLink",
    role: "Graphic Designer",
    description:
      "Кросс-функциональная команда. UI/UX дизайн и брендинг образовательной платформы.",
    tags: ["Graphic Design", "Team Management", "Strategy", "Leadership", "EdTech"],
  },
  {
    period: "Июнь 2025 — н.в.",
    company: "Myextra Hub",
    role: "Graphic Designer",
    description:
      "Брендинг и дизайн-система. Разработка концепции и презентаций.",
    tags: ["Graphic Design", "Branding", "Motion Design"],
  },
  {
    period: "Окт 2024 — н.в.",
    company: "Freelance",
    role: "Graphic Designer",
    description:
      "Визуальные решения для бизнеса и стартапов. Брендинг, презентации, контент для соцсетей.",
    tags: ["Pitch Decks", "Branding", "Web Content", "Social Media"],
  },
  {
    period: "Авг — Окт 2024",
    company: "BAITC",
    role: "Graphic Designer",
    description:
      "Дизайн для IT-ивентов: AI Bootcamp, хакатоны. Контент для соцсетей.",
    tags: ["Event Design", "Visuals", "Social Media", "Presentations"],
  },
];

const education = [
  {
    period: "2025 — 2026",
    institution: "inVision U by inDrive",
    program: "Foundation",
  },
  {
    period: "2014 — 2025",
    institution: "High School №44",
    program: "Общее образование",
  },
];

const Resume = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <h1 className="heading-display text-5xl md:text-7xl text-foreground mb-16">
        Резюме
      </h1>

      {/* Experience */}
      <div className="mb-20">
        <h2 className="heading-display text-2xl text-primary mb-10 uppercase tracking-widest text-sm font-medium">
          Опыт работы
        </h2>
        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <div key={i} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div className="text-sm text-muted-foreground font-medium">
                {exp.period}
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="heading-display text-xl text-foreground">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-primary">{exp.role}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="heading-display text-2xl text-primary mb-10 uppercase tracking-widest text-sm font-medium">
          Образование
        </h2>
        <div className="space-y-8">
          {education.map((edu, i) => (
            <div key={i} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8">
              <div className="text-sm text-muted-foreground font-medium">
                {edu.period}
              </div>
              <div>
                <h3 className="heading-display text-xl text-foreground">
                  {edu.institution}
                </h3>
                <p className="text-sm text-muted-foreground">{edu.program}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resume;
