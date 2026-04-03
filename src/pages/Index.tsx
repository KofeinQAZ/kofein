import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo-updated.png";

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
        <div className="space-y-8">
          {/* Logo visual */}
          <img src={logo} alt="Rasul Kapash" className="w-full max-w-xl md:max-w-2xl h-auto mx-0 my-0 px-0 mr-[5px] mb-0 ml-0" />

          {/* Bio — casual tone */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed text-justify">
             и проекты это всё моё <span>{"🤙"}</span>
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:opacity-90 transition-opacity group"
            >
              мои работы
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-3 border-2 border-foreground text-foreground px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-foreground hover:text-background transition-colors"
            >
              написать мне
            </Link>
          </div>
        </div>
      </section>

      {/* About / Skills Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <h2 className="heading-display text-3xl md:text-5xl text-foreground mb-12">
          кто я такой<span className="text-primary">?</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Графический дизайнер из Алматы. Делаю брендинг, дизайн-системы, 
              презентации и UI/UX — для стартапов и образовательных проектов.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Люблю чистый дизайн, но не боюсь экспериментов. 
              Главное — чтобы всё работало и выглядело 🔥
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">скиллы</h3>
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
              <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">языки</h3>
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
