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
    <div className="min-h-screen">
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

      {/* Featured projects — scroll-driven */}
      <FeaturedProjectsScroll />

      {/* About / Skills Section — dark */}
      <section
        data-nav-theme="dark"
        className="relative overflow-hidden bg-[#0a0a0a] text-white px-6 md:px-12 py-20 md:py-28"
      >
        {/* subtle backdrop accents */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] rounded-full bg-primary/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Eyebrow + heading */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-semibold">
              About
            </span>
          </div>

          <motion.h2
            className="heading-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-14 md:mb-20 max-w-4xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            кто я такой<span className="text-primary">{"?"}</span>
          </motion.h2>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Bio card */}
            <motion.div
              className="lg:col-span-5 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-7 md:p-9 flex flex-col gap-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                Графический дизайнер из Алматы. Делаю брендинг,
                дизайн-системы, презентации и UI/UX для стартапов и
                образовательных проектов.
              </p>
              <div className="flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <motion.img
                  src={photoBack}
                  alt="Rasul from behind"
                  className="w-44 md:w-52 h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                />
              </div>
            </motion.div>

            {/* Skills + Languages */}
            <div className="lg:col-span-7 space-y-10">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-6 bg-white/40" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">
                    Скиллы
                  </h3>
                </div>
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
                      whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
                      className={`text-xs md:text-sm rounded-full px-5 py-2.5 font-medium cursor-default transition-colors ${
                        skill.style === "dark"
                          ? "bg-white text-black"
                          : skill.style === "primary"
                          ? "border border-primary text-primary bg-primary/5"
                          : "bg-white/10 text-white border border-white/10"
                      }`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-6 bg-white/40" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-bold">
                    Языки
                  </h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {languages.map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <motion.img
                        src={lang.flag}
                        alt={lang.name}
                        className="w-9 h-9 object-contain flex-shrink-0"
                        whileHover={{ scale: 1.15, rotate: 5, transition: { duration: 0.2 } }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-white/50 leading-tight uppercase tracking-wider">
                          {lang.level}
                        </span>
                        <span className="text-sm font-semibold text-white leading-tight truncate">
                          {lang.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
