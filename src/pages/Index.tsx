import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Keywords */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground tracking-widest uppercase">
          {["vision", "design", "branding", "identity", "motion"].map((word) => (
            <span key={word} className="border border-border rounded-full px-4 py-1.5">
              {word}
            </span>
          ))}
        </div>

        {/* Main heading */}
        <h1 className="heading-display text-6xl md:text-8xl lg:text-9xl text-foreground leading-[0.9]">
          Rasul
          <br />
          <span className="text-primary">Kapash</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
          Графический дизайнер из Алматы. Создаю визуальные решения
          для бизнеса и стартапов — от брендинга до презентаций.
        </p>

        {/* CTA */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity group"
        >
          Смотреть работы
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default Index;
