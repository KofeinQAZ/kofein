import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo-updated.svg";
import photoSpeaking from "@/assets/photo-speaking.png";
import photoCertificate from "@/assets/photo-certificate.png";
import photoBack from "@/assets/photo-back.png";
import flagKz from "@/assets/flag-kz.png";
import flagRu from "@/assets/flag-ru.png";
import flagGb from "@/assets/flag-gb.png";
import FeaturedProjectsScroll from "@/components/home/FeaturedProjectsScroll";

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
  { flag: flagKz, name: "Казахский", level: "Родной" },
  { flag: flagRu, name: "Русский", level: "Продвинутый" },
  { flag: flagGb, name: "Английский", level: "B1 - средний" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const pillPop = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center px-6 md:px-12 max-w-7xl mx-auto pt-12 md:pt-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          {/* Left column — typography + CTA */}
          <div className="space-y-6">
            {/* Big typographic block */}
            <div className="space-y-0 leading-none">
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="heading-display text-[clamp(3rem,8vw,6.5rem)] text-foreground leading-[0.9] tracking-tight font-black">
                  RASUL
                </span>
                <motion.div
                  className="flex flex-col text-primary text-sm md:text-base font-medium mt-2 leading-snug"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {["vision", "design", "branding"].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-end gap-3"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  className="flex flex-col text-primary text-sm md:text-base font-medium leading-snug mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {["media", "creativity", "leadership"].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
                <span className="heading-display text-[clamp(3rem,8vw,6.5rem)] text-foreground leading-[0.9] tracking-[0.15em] font-black">
                  KAPASH
                </span>
              </motion.div>
            </div>

            {/* Bio */}
            <motion.p
              className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              уо, я Creative Lead, мне 18. Объединяю визуал, продуктовое мышление и
              управление командой. Делаю так, чтобы продукт был не просто красивым а
              реально работал. Брендинг, no-code, проекты это всё моё <span>{"👍"}</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:opacity-90 transition-all hover:scale-105 active:scale-95 group"
              >
                мои работы
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contacts"
                className="inline-flex items-center gap-3 border-2 border-foreground text-foreground px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:bg-foreground hover:text-background transition-all hover:scale-105 active:scale-95"
              >
                написать мне
              </Link>
            </motion.div>
          </div>

          {/* Right column — photos */}
          <div className="flex items-end justify-center gap-3 md:gap-4">
            <motion.img
              src={photoSpeaking}
              alt="Rasul speaking"
              className="w-[40%] max-w-[220px] h-auto object-contain rounded-2xl"
              decoding="async"
              fetchPriority="high"
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.03, rotate: -1, transition: { duration: 0.3 } }}
            />
            <motion.img
              src={photoCertificate}
              alt="Rasul with certificate"
              className="w-[55%] max-w-[320px] h-auto object-contain rounded-2xl"
              decoding="async"
              fetchPriority="high"
              initial={{ opacity: 0, y: 50, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.03, rotate: 1, transition: { duration: 0.3 } }}
            />
          </div>
        </div>
      </section>

      {/* About / Skills Section */}
      <section className="px-6 md:px-12 pt-6 pb-20 max-w-7xl mx-auto">
        <motion.h2
          className="heading-display text-3xl md:text-5xl text-foreground mb-12"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          кто я такой<span className="text-primary">{"?"}</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <motion.p
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              Графический дизайнер из Алматы. Делаю брендинг, дизайн-системы,
              презентации и UI/UX для стартапов и образовательных проектов.
            </motion.p>
            <motion.img
              src={photoBack}
              alt="Rasul from behind"
              className="w-56 md:w-64 h-auto object-contain mx-auto md:mx-0"
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            />
          </div>

          {/* Skills & Languages */}
          <div className="space-y-10">
            <div>
              <motion.h3
                className="text-xs uppercase tracking-[0.25em] text-foreground font-bold mb-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                СКИЛЛЫ
              </motion.h3>
              <motion.div
                className="flex flex-wrap gap-2.5"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill.name}
                    variants={pillPop}
                    whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
                    className={`text-xs rounded-full px-5 py-2.5 font-medium cursor-default transition-shadow ${
                      skill.style === "dark"
                        ? "bg-foreground text-background"
                        : skill.style === "primary"
                        ? "border border-primary text-primary"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <div>
              <motion.h3
                className="text-xs uppercase tracking-[0.25em] text-foreground font-bold mb-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                ЯЗЫКИ
              </motion.h3>
              <div className="flex flex-wrap gap-6">
                {languages.map((lang, i) => (
                  <motion.div
                    key={lang.name}
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <motion.img
                      src={lang.flag}
                      alt={lang.name}
                      className="w-7 h-7 object-contain"
                      whileHover={{ scale: 1.2, rotate: 5, transition: { duration: 0.2 } }}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground leading-tight">
                        {lang.level}
                      </span>
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {lang.name}
                      </span>
                    </div>
                  </motion.div>
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
