import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo-updated.svg";
import photoSpeaking from "@/assets/photo-speaking.png";
import photoCertificate from "@/assets/photo-certificate.png";
import photoBack from "@/assets/photo-back.png";

const skills = [
  { name: "Graphic Design", style: "dark" },
  { name: "Branding", style: "primary" },
  { name: "UI/UX Design", style: "light" },
  { name: "Motion Design", style: "dark" },
  { name: "Pitch Decks", style: "primary" },
  { name: "Презентации", style: "light" },
  { name: "Social Media Design", style: "dark" },
  { name: "Event Design", style: "primary" },
  { name: "Web Content", style: "light" },
  { name: "Figma", style: "dark" },
  { name: "Adobe Creative Suite", style: "primary" },
  { name: "After Effects", style: "light" },
];

const languages = [
  { flag: "🇰🇿", name: "Казахский", level: "Родной" },
  { flag: "🇷🇺", name: "Русский", level: "Продвинутый" },
  { flag: "🇬🇧", name: "Английский", level: "B1 - средний" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          {/* Left column — typography + CTA */}
          <div className="space-y-6">
            {/* Big typographic block */}
            <div className="space-y-0 leading-none">
              <div className="flex items-start gap-3">
                <span className="heading-display text-[clamp(3rem,8vw,6.5rem)] text-foreground leading-[0.9] tracking-tight font-black">
                  RASUL
                </span>
                <div className="flex flex-col text-primary text-sm md:text-base font-medium mt-2 leading-snug">
                  <span>vision</span>
                  <span>design</span>
                  <span>branding</span>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex flex-col text-primary text-sm md:text-base font-medium leading-snug mb-1">
                  <span>media</span>
                  <span>creativity</span>
                  <span>leadership</span>
                </div>
                <span className="heading-display text-[clamp(3rem,8vw,6.5rem)] text-foreground leading-[0.9] tracking-[0.15em] font-black">
                  KAPASH
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
              уо, я Creative Lead, мне 18. Объединяю визуал, продуктовое мышление и
              управление командой. Делаю так, чтобы продукт был не просто красивым а
              реально работал. Брендинг, no-code, проекты это всё моё <span>{"👍"}</span>
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

          {/* Right column — photos */}
          <div className="flex items-end justify-center gap-3 md:gap-4">
            <img
              src={photoSpeaking}
              alt="Rasul speaking"
              className="w-[40%] max-w-[220px] h-auto object-contain rounded-2xl"
            />
            <img
              src={photoCertificate}
              alt="Rasul with certificate"
              className="w-[55%] max-w-[320px] h-auto object-contain rounded-2xl"
            />
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
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Графический дизайнер из Алматы. Делаю брендинг, дизайн-системы,
              презентации и UI/UX для стартапов и образовательных проектов.
            </p>
            {/* Photo in about section */}
            <img
              src={photoBack}
              alt="Rasul from behind"
              className="w-56 md:w-64 h-auto object-contain mx-auto md:mx-0"
            />
          </div>

          {/* Skills & Languages */}
          <div className="space-y-10">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-bold mb-5">
                СКИЛЛЫ
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`text-xs rounded-full px-5 py-2.5 font-medium cursor-default transition-all ${
                      skill.style === "dark"
                        ? "bg-foreground text-background"
                        : skill.style === "primary"
                        ? "border border-primary text-primary"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-foreground font-bold mb-5">
                ЯЗЫКИ
              </h3>
              <div className="flex flex-wrap gap-6">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2.5">
                    <span className="text-2xl"><span>{lang.flag}</span></span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {lang.level}
                      </span>
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {lang.name}
                      </span>
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
