import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const skills = [
  "Graphic Design", "Branding", "UI/UX Design", "Motion Design",
  "Pitch Decks", "Презентации", "Social Media Design", "Event Design",
  "Web Content", "Figma", "Adobe Creative Suite", "After Effects"
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Keywords */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground tracking-[0.2em] uppercase font-medium">
            {["vision", "design", "branding", "media", "creativity", "leadership"].map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>

          {/* Main heading — bold editorial like the resume */}
          <h1 className="text-[clamp(3.5rem,12vw,11rem)] font-black tracking-tighter leading-[0.85] text-foreground uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Rasul
            <br />
            <span className="text-primary">Kapash</span>
          </h1>

          {/* Bio */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            <span className="text-primary font-semibold">Creative Lead</span>, 18 лет. Объединяю сильный визуал, продуктовое мышление и управление командой. 
            Отвечаю за то, чтобы продукт был не только стильным, но и решал реальные задачи пользователей. 
            Создаю брендинг и запускаю <span className="text-primary font-semibold">no-code</span> проекты.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:opacity-90 transition-opacity group uppercase"
            >
              Смотреть работы
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-3 border-2 border-foreground text-foreground px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-foreground hover:text-background transition-colors uppercase"
            >
              Связаться
            </Link>
          </div>
        </div>
      </section>

      {/* About / Skills Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium mb-10">
          Кто я такой?
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Графический дизайнер из Алматы, Казахстан.
              Работаю с брендингом, дизайн-системами, презентациями и UI/UX.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Мой подход — чистый, минималистичный дизайн с вниманием к деталям
              и функциональности. Активно работаю в образовательных проектах и IT-стартапах.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">Навыки</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs border border-border rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">Языки</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>🇰🇿 Казахский — родной</li>
                <li>🇷🇺 Русский — продвинутый</li>
                <li>🇬🇧 Английский — B1</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
