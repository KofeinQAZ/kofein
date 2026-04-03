const About = () => {
  const skills = [
    "Graphic Design", "Branding", "UI/UX Design", "Motion Design",
    "Pitch Decks", "Презентации", "Social Media Design", "Event Design",
    "Web Content", "Figma", "Adobe Creative Suite", "After Effects"
  ];

  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <h1 className="heading-display text-5xl md:text-7xl text-foreground mb-16">
        Обо <span className="text-primary">мне</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Привет! Я Расул Капаш — графический дизайнер из Алматы, Казахстан.
            Создаю визуальные решения для бизнеса и стартапов.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Работаю с брендингом, дизайн-системами, презентациями и UI/UX.
            Мой подход — чистый, минималистичный дизайн с вниманием к деталям
            и функциональности.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Сейчас активно работаю в образовательных проектах и IT-стартапах,
            помогая командам создавать сильную визуальную идентичность.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="heading-display text-2xl text-foreground mb-6">Навыки</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm border border-border rounded-full px-4 py-2 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="heading-display text-2xl text-foreground mb-4">Языки</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>🇰🇿 Казахский — родной</li>
              <li>🇷🇺 Русский — продвинутый</li>
              <li>🇬🇧 Английский — B1</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
