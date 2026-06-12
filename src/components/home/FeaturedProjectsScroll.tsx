import { useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const ACCENTS = [
  { name: "blue",   hue: "210 100% 65%", rgb: "92, 160, 255" },
  { name: "amber",  hue: "32 100% 60%",  rgb: "255, 160, 60" },
  { name: "teal",   hue: "168 80% 55%",  rgb: "60, 220, 200" },
  { name: "violet", hue: "270 90% 70%",  rgb: "180, 130, 255" },
  { name: "rose",   hue: "340 90% 65%",  rgb: "255, 110, 160" },
  { name: "lime",   hue: "90 80% 60%",   rgb: "180, 240, 90" },
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

  if (isLoading) return null;
  if (!projects || projects.length === 0) return null;

  const count = projects.length;
  const sectionHeight = `${count * 100}vh`;

  return (
    <section
      ref={sectionRef}
      data-nav-theme="dark"
      className="relative bg-black text-white"
      style={{ height: sectionHeight }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Parallax tunnel backgrounds — one per project, crossfaded */}
        {projects.map((project, i) => (
          <TunnelBackdrop
            key={project.id}
            index={i}
            count={count}
            progress={scrollYProgress}
            accent={ACCENTS[i % ACCENTS.length]}
          />
        ))}

        {/* Top progress + counter — pushed below the fixed navbar */}
        <div className="absolute top-0 inset-x-0 z-30 pt-24 sm:pt-28 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-3 sm:gap-6">
            <div className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/60 font-mono">
              / {String(count).padStart(2, "0")} · WORK
              <div className="text-white/40 mt-1 hidden sm:block">SELECTED PROJECTS</div>
            </div>
            <SegmentedProgress progress={scrollYProgress} count={count} />
            <CounterDisplay progress={scrollYProgress} count={count} />
          </div>
        </div>

        {/* Foreground content per project */}
        <div className="absolute inset-0">
          {projects.map((project, i) => (
            <ProjectForeground
              key={project.id}
              project={project}
              index={i}
              count={count}
              progress={scrollYProgress}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-5 inset-x-0 z-30 flex flex-col items-center gap-1 pointer-events-none">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.4em] text-white/50">
            DRIVE INTO THE TUNNEL
          </p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <ChevronDown size={14} className="text-white/50" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   TUNNEL BACKDROP — true camera-through-tunnel parallax.
   Bars are positioned with 3D translateZ and fly past camera
   as scroll progresses through this segment.
   ============================================================ */
const TunnelBackdrop = ({
  index,
  count,
  progress,
  accent,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  accent: { hue: string; rgb: string };
}) => {
  const start = index / count;
  const end = (index + 1) / count;
  const cf = 0.04 / count;
  const fadeIn = Math.max(0, start - cf);
  const fadeOut = Math.min(1, end + cf);

  const opacity = useTransform(
    progress,
    [fadeIn, start + cf, end - cf, fadeOut],
    [0, 1, 1, 0]
  );

  // Local segment progress 0 → 1
  const local = useTransform(progress, [start, end], [0, 1]);

  // Camera-forward push for the whole tunnel
  const cameraZ = useTransform(local, [0, 1], [0, 900]);
  const glowScale = useTransform(local, [0, 1], [0.7, 2.2]);
  const glowOpacity = useTransform(local, [0, 1], [0.4, 0.95]);

  // Deterministic bar layout — each bar gets a depth (z) and side offset
  const bars = useMemo(() => {
    const arr: {
      side: number;       // -1 left, +1 right
      offsetX: number;    // distance from center in vw
      z: number;          // depth (-1500 far → 0 near)
      heightVh: number;
      opacity: number;
      delay: number;
    }[] = [];
    const seed = index * 13 + 7;
    const N = 26;
    for (let i = 0; i < N; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const depthT = i / N; // 0 near, 1 far
      const z = -depthT * 1500 - 50;
      const offsetX = 15 + ((i * 7 + seed) % 25) + depthT * 10;
      arr.push({
        side,
        offsetX,
        z,
        heightVh: 50 + ((i * 17 + seed) % 40),
        opacity: 0.35 + ((i * 11) % 55) / 100,
        delay: (i * 0.07) % 1.4,
      });
    }
    return arr;
  }, [index]);

  const particles = useMemo(() => {
    const arr: { x: number; y: number; z: number; size: number; delay: number; duration: number }[] = [];
    const seed = index * 31 + 3;
    for (let i = 0; i < 36; i++) {
      arr.push({
        x: ((i * 53 + seed) % 100) - 50,
        y: ((i * 37 + seed * 2) % 80) - 40,
        z: -((i * 97 + seed) % 1400) - 100,
        size: 1 + ((i + seed) % 3),
        delay: ((i * 0.13) % 2),
        duration: 2.5 + ((i * 0.31) % 2.5),
      });
    }
    return arr;
  }, [index]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 will-change-[opacity]"
    >
      {/* Base radial */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 55%, hsl(${accent.hue} / 0.18), #000 65%)`,
        }}
      />

      {/* 3D stage — camera moves forward by translating Z */}
      <motion.div
        style={{
          translateZ: cameraZ,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 will-change-transform"
      >
        {/* Vertical light bars in 3D */}
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-px will-change-transform"
            style={{
              height: `${b.heightVh}vh`,
              marginTop: `-${b.heightVh / 2}vh`,
              translateX: `${b.side * b.offsetX}vw`,
              translateZ: b.z,
              opacity: b.opacity,
              background: `linear-gradient(to bottom, transparent, rgba(${accent.rgb}, 0.95), transparent)`,
              boxShadow: `0 0 14px rgba(${accent.rgb}, 0.7)`,
            }}
            animate={{
              opacity: [b.opacity * 0.5, b.opacity, b.opacity * 0.5],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: b.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floor perspective lines (vanishing into center) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-50"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id={`floor-${index}`} x1="0" y1="100%" x2="0" y2="0%">
              <stop offset="0%" stopColor={`rgba(${accent.rgb}, 0.7)`} />
              <stop offset="100%" stopColor={`rgba(${accent.rgb}, 0)`} />
            </linearGradient>
          </defs>
          {[10, 25, 40, 50, 60, 75, 90].map((x) => (
            <line
              key={x}
              x1={x}
              y1="100"
              x2="50"
              y2="55"
              stroke={`url(#floor-${index})`}
              strokeWidth="0.12"
            />
          ))}
          {/* Horizon line */}
          <line x1="0" y1="55" x2="100" y2="55" stroke={`rgba(${accent.rgb}, 0.15)`} strokeWidth="0.1" />
        </svg>

        {/* Particles in 3D space */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full will-change-transform"
            style={{
              width: p.size,
              height: p.size,
              translateX: `${p.x}vw`,
              translateY: `${p.y}vh`,
              translateZ: p.z,
              background: `rgba(${accent.rgb}, 0.95)`,
              boxShadow: `0 0 8px rgba(${accent.rgb}, 0.9)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.6, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Vanishing-point glow (screen-space, not in 3D) */}
      <motion.div
        style={{
          scale: glowScale,
          opacity: glowOpacity,
          background: `radial-gradient(circle, rgba(${accent.rgb}, 0.6) 0%, transparent 60%)`,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vmin] h-[45vmin] will-change-transform pointer-events-none"
      />

      {/* Vignette for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />
    </motion.div>
  );
};

/* ============================================================
   PROJECT FOREGROUND — title, meta, CTA
   ============================================================ */
const ProjectForeground = ({
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
  accent: { hue: string; rgb: string };
}) => {
  const start = index / count;
  const end = (index + 1) / count;
  const span = end - start;

  const opacity = useTransform(
    progress,
    [start - span * 0.1, start + span * 0.2, end - span * 0.2, end + span * 0.1],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], [40, -40]);

  const accentText = `hsl(${accent.hue})`;

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-6 text-center z-20 pointer-events-none"
    >
      <div
        className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-3 sm:mb-5 font-mono"
        style={{ color: accentText }}
      >
        {project.category || "PROJECT"} · {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>

      <h2
        className="heading-display text-white font-black leading-[0.95] tracking-[-0.03em] max-w-[92vw] break-words"
        style={{
          fontSize: "clamp(2rem, 9vw, 7rem)",
          textShadow: `0 0 40px rgba(${accent.rgb}, 0.35)`,
        }}
      >
        {project.title}
      </h2>

      {project.short_description && (
        <p className="mt-4 sm:mt-6 max-w-md sm:max-w-xl text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
          {project.short_description}
        </p>
      )}

      {project.tools && project.tools.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mt-4 sm:mt-5">
          {project.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border backdrop-blur-sm"
              style={{
                borderColor: `rgba(${accent.rgb}, 0.4)`,
                color: accentText,
                background: `rgba(${accent.rgb}, 0.08)`,
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/portfolio/${project.id}`}
        className="mt-6 sm:mt-8 inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white hover:gap-3 transition-all group pointer-events-auto px-4 sm:px-5 py-2.5 sm:py-3 border rounded-full"
        style={{
          borderColor: `rgba(${accent.rgb}, 0.5)`,
          background: `rgba(${accent.rgb}, 0.08)`,
        }}
      >
        Открыть проект
        <ArrowUpRight
          size={14}
          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        />
      </Link>
    </motion.div>
  );
};

const SegmentedProgress = ({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) => (
  <div className="flex-1 max-w-2xl flex gap-1 sm:gap-2 mt-1.5 sm:mt-2">
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
    <div className="text-right font-mono text-xs sm:text-sm md:text-base tabular-nums">
      <motion.span className="text-white">{current}</motion.span>
      <span className="text-white/40"> / {String(count).padStart(2, "0")}</span>
    </div>
  );
};

export default FeaturedProjectsScroll;
