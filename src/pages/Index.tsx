import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo-updated.svg";

const skills = [
  "Graphic Design", "Branding", "UI/UX Design", "Motion Design",
  "Pitch Decks", "Презентации", "Social Media Design", "Event Design",
  "Web Content", "Figma", "Adobe Creative Suite", "After Effects"
];

const languages = [
  { flag: "🇰🇿", name: "Казахский", level: "родной" },
  { flag: "🇷🇺", name: "Русский", level: "продвинутый" },
  { flag: "🇬🇧", name: "Английский", level: "B1" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Logo visual */}
          <img src={logo} alt="Rasul Kapash" className="w-full max-w-xl md:max-w-2xl h-auto" />

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
      <section className="px-6 md:px-12 pt-6 pb-20 max-w-7xl mx-auto">
        <h2 className="heading-display text-3xl md:text-5xl text-foreground mb-12">
          кто я такой<span className="text-primary">{"?"}</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Графический дизайнер из Алматы. Делаю брендинг, дизайн-системы, 
              презентации и UI/UX — для стартапов и образовательных проектов.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Люблю чистый дизайн, но не боюсь экспериментов. 
              Главное — чтобы всё работало и выглядело <span>{"🔥"}</span>
            </p>
          </div>

          {/* Skills & Languages — visual cards */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground font-bold mb-5">
                <span>{"⚡"}</span> скиллы
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className={`text-xs rounded-full px-4 py-2.5 font-semibold transition-all cursor-default ${
                      i % 3 === 0
                        ? "bg-foreground text-background"
                        : i % 3 === 1
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-foreground font-bold mb-5">
                <span>{"🌍"}</span> языки
              </h3>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center gap-2.5 bg-muted rounded-full px-5 py-3"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground leading-tight">{lang.name}</span>
                      <span className="text-xs text-muted-foreground leading-tight">{lang.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
