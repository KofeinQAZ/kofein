import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

// Accent colors that rotate per project (matches Ahmed Asif vibe but keeps our brand)
const ACCENTS = [
  "168 70% 55%", // turquoise (brand)
  "32 95% 60%",  // amber
  "0 75% 60%",   // red
  "265 70% 65%", // violet
  "210 90% 60%", // blue
  "140 60% 55%", // green
];

const FeaturedProjectsScroll = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll for tunnel motion
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  if (isLoading) return null;
  if (!projects || projects.length === 0) return null;

  const count = projects.length;
  // Each project gets ~150vh of scroll so it really "locks"
  const sectionHeight = `${count * 150}vh`;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[hsl(0_0%_4%)] text-white"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* TUNNEL BACKGROUND — animates with scroll */}
        <TunnelBackground progress={smooth} projects={projects} />

        {/* TOP PROGRESS BAR */}
        <div className="absolute top-0 inset-x-0 z-30 pt-6 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60 font-mono">
              / 0{count} · WORK
              <div className="text-white/40 mt-1 text-[10px]">SELECTED PROJECTS</div>
            </div>
            <SegmentedProgress progress={scrollYProgress} count={count} />
            <CounterDisplay progress={scrollYProgress} count={count} />
          </div>
        </div>

        {/* PROJECT STAGE */}
        <div className="absolute inset-0 flex items-center justify-center">
          {projects.map((project, i) => (
            <ProjectStage
              key={project.id}
              project={project}
              index={i}
              count={count}
              progress={scrollYProgress}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        {/* SIDE JUMP NAV */}
        <SideJumpNav progress={scrollYProgress} projects={projects} />

        {/* BOTTOM CTA */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center gap-1 pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
            DRIVE THROUGH
          </p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <ChevronDown size={16} className="text-white/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   TUNNEL BACKGROUND — vertical light bars in perspective
   ============================================================ */
const TunnelBackground = ({
  progress,
  projects,
}: {
  progress: MotionValue<number>;
  projects: Project[];
}) => {
  // Color shifts between accents as you scroll
  const count = projects.length;
  const accentHue = useTransform(progress, (p) => {
    const idx = Math.min(Math.floor(p * count), count - 1);
    return ACCENTS[idx % ACCENTS.length];
  });

  // Tunnel "pull" — bars stretch as you scroll giving motion feel
  const tunnelScale = useTransform(progress, [0, 1], [1, 2.5]);
  const tunnelOpacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity: tunnelOpacity }}
      className="absolute inset-0 pointer-events-none"
    >
      {/* Radial accent glow at the vanishing point */}
      <motion.div
        style={{
          background: useTransform(
            accentHue,
            (h) =>
              `radial-gradient(ellipse 60% 50% at 50% 55%, hsl(${h} / 0.35), transparent 70%)`
          ),
        }}
        className="absolute inset-0"
      />

      {/* Vertical light bars (tunnel walls) */}
      <motion.div
        style={{ scale: tunnelScale }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-full h-full">
          {Array.from({ length: 24 }).map((_, i) => {
            const side = i < 12 ? -1 : 1;
            const idx = i % 12;
            // Distance from center — closer to edges = closer to camera
            const offset = (idx + 1) / 12;
            const left = 50 + side * offset * 55;
            const height = 30 + offset * 70;
            const blur = (1 - offset) * 8;
            return (
              <motion.div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-[2px] rounded-full"
                style={{
                  left: `${left}%`,
                  height: `${height}%`,
                  filter: `blur(${blur}px)`,
                  background: useTransform(
                    accentHue,
                    (h) =>
                      `linear-gradient(to bottom, transparent, hsl(${h} / 0.9), transparent)`
                  ),
                  opacity: 0.3 + offset * 0.7,
                }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Floor perspective lines */}
      <motion.div
        style={{ scale: tunnelScale }}
        className="absolute inset-0 flex items-end justify-center pb-[15%]"
      >
        <motion.div
          className="w-[2px] h-[40%]"
          style={{
            background: useTransform(
              accentHue,
              (h) => `linear-gradient(to top, hsl(${h} / 0.8), transparent)`
            ),
          }}
        />
      </motion.div>

      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Particle key={i} index={i} progress={progress} accentHue={accentHue} />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(0_0%_4%)_85%)]" />
    </motion.div>
  );
};

const Particle = ({
  index,
  progress,
  accentHue,
}: {
  index: number;
  progress: MotionValue<number>;
  accentHue: MotionValue<string>;
}) => {
  const seed = (index * 137.5) % 100;
  const x = `${(seed * 7.3) % 100}%`;
  const baseY = (seed * 3.1) % 100;
  const y = useTransform(progress, [0, 1], [`${baseY}%`, `${(baseY + 80) % 100}%`]);
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0]);
  const size = 1 + (seed % 3);
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        background: useTransform(accentHue, (h) => `hsl(${h})`),
        boxShadow: useTransform(accentHue, (h) => `0 0 ${size * 4}px hsl(${h})`),
      }}
    />
  );
};

/* ============================================================
   TOP PROGRESS — segmented bars
   ============================================================ */
const SegmentedProgress = ({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) => (
  <div className="flex-1 max-w-2xl flex gap-2 mt-2">
    {Array.from({ length: count }).map((_, i) => (
      <ProgressSegment key={i} index={i} count={count} progress={progress} />
    ))}
  </div>
);

const ProgressSegment = ({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
}) => {
  const fill = useTransform(progress, (p) => {
    const local = Math.min(Math.max(p * count - index, 0), 1);
    return `${local * 100}%`;
  });
  return (
    <div className="flex-1 h-[2px] bg-white/15 overflow-hidden">
      <motion.div style={{ width: fill }} className="h-full bg-white" />
    </div>
  );
};

const CounterDisplay = ({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) => {
  const current = useTransform(progress, (p) => {
    const idx = Math.min(Math.floor(p * count) + 1, count);
    return String(idx).padStart(2, "0");
  });
  return (
    <div className="text-right font-mono text-sm md:text-base tabular-nums">
      <motion.span className="text-white">{current}</motion.span>
      <span className="text-white/40"> / {String(count).padStart(2, "0")}</span>
    </div>
  );
};

/* ============================================================
   SIDE JUMP NAV
   ============================================================ */
const SideJumpNav = ({
  progress,
  projects,
}: {
  progress: MotionValue<number>;
  projects: Project[];
}) => {
  const count = projects.length;
  return (
    <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2 text-right">
        JUMP
      </div>
      {projects.map((p, i) => (
        <JumpItem
          key={p.id}
          index={i}
          count={count}
          progress={progress}
          title={p.title}
        />
      ))}
    </div>
  );
};

const JumpItem = ({
  index,
  count,
  progress,
  title,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  title: string;
}) => {
  const opacity = useTransform(progress, (p) => {
    const idx = Math.min(Math.floor(p * count), count - 1);
    return idx === index ? 1 : 0.35;
  });
  const lineWidth = useTransform(progress, (p) => {
    const idx = Math.min(Math.floor(p * count), count - 1);
    return idx === index ? "32px" : "12px";
  });
  return (
    <motion.div
      style={{ opacity }}
      className="flex items-center justify-end gap-3 text-right"
    >
      <span className="text-xs font-mono text-white max-w-[140px] truncate">
        {title}
      </span>
      <motion.div style={{ width: lineWidth }} className="h-[1px] bg-white" />
    </motion.div>
  );
};

/* ============================================================
   PROJECT STAGE — huge brand-style title + meta
   ============================================================ */
const ProjectStage = ({
  project,
  index,
  count,
  progress,
  accent,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
  accent: string;
}) => {
  const start = index / count;
  const end = (index + 1) / count;
  const span = end - start;

  // Fade window: enter quickly, hold long, exit quickly
  const opacity = useTransform(
    progress,
    [start - span * 0.15, start + span * 0.15, end - span * 0.15, end + span * 0.15],
    [0, 1, 1, 0]
  );
  // Slide up through center
  const y = useTransform(
    progress,
    [start - span * 0.4, start + span * 0.5, end + span * 0.4],
    [120, 0, -120]
  );
  // Subtle scale
  const scale = useTransform(
    progress,
    [start - span * 0.4, start + span * 0.5, end + span * 0.4],
    [0.92, 1, 1.08]
  );
  // Blur in/out
  const filter = useTransform(
    progress,
    [start - span * 0.2, start + span * 0.1, end - span * 0.1, end + span * 0.2],
    ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]
  );

  return (
    <motion.div
      style={{ opacity, y, scale, filter }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      {/* Kicker */}
      <div
        className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono"
        style={{ color: `hsl(${accent})` }}
      >
        {project.category || "PROJECT"} · {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>

      {/* HUGE TITLE — like "Microsoft" / "Amazon" */}
      <h2 className="heading-display text-white font-black leading-[0.9] tracking-[-0.04em] text-[clamp(3.5rem,14vw,12rem)] max-w-[90vw] break-words">
        {project.title}
      </h2>

      {/* Short description */}
      {project.short_description && (
        <p className="mt-8 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
          {project.short_description}
        </p>
      )}

      {/* Cover image — small floating preview */}
      {project.cover_image && (
        <div className="mt-8 w-32 md:w-40 aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-white/10">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Tools */}
      {project.tools && project.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {project.tools.slice(0, 5).map((tool) => (
            <span
              key={tool}
              className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border"
              style={{
                borderColor: `hsl(${accent} / 0.5)`,
                color: `hsl(${accent})`,
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        to={`/portfolio/${project.id}`}
        className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white hover:gap-3 transition-all group"
      >
        VISIT {project.title.toUpperCase().slice(0, 12)}
        <ArrowUpRight
          size={16}
          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          style={{ color: `hsl(${accent})` }}
        />
      </Link>
    </motion.div>
  );
};

export default FeaturedProjectsScroll;
