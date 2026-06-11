import { useRef } from "react";
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
  // Each project = 1 full viewport of scroll (acts like a slider step)
  const sectionHeight = `${count * 100}vh`;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white"
      style={{ height: sectionHeight }}
    >
      {/* Sticky stage that pins while we scroll through all projects */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layered parallax backgrounds (one per project) */}
        {projects.map((project, i) => (
          <ProjectBackdrop
            key={project.id}
            project={project}
            index={i}
            count={count}
            progress={scrollYProgress}
          />
        ))}

        {/* Top progress + counter */}
        <div className="absolute top-0 inset-x-0 z-30 pt-6 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/60 font-mono">
              / {String(count).padStart(2, "0")} · WORK
              <div className="text-white/40 mt-1 text-[10px]">SELECTED PROJECTS</div>
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
            />
          ))}
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center gap-1 pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
            SCROLL
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
   PROJECT BACKDROP — parallax zoom-in cover image per project
   ============================================================ */
const ProjectBackdrop = ({
  project,
  index,
  count,
  progress,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) => {
  const start = index / count;
  const end = (index + 1) / count;
  // Tight crossfade right at the boundary so only one image is visible at a time
  const cf = 0.04 / count; // ~4% of one segment
  const fadeIn = Math.max(0, start - cf);
  const fadeOut = Math.min(1, end + cf);

  const opacity = useTransform(
    progress,
    [fadeIn, start + cf, end - cf, fadeOut],
    [0, 1, 1, 0]
  );

  // Strong parallax zoom: bg "approaches" the viewer through the whole segment
  const scale = useTransform(progress, [start, end], [1.05, 1.5]);
  const y = useTransform(progress, [start, end], ["3%", "-6%"]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 will-change-[opacity]"
    >
      {project.cover_image ? (
        <motion.div
          style={{ scale, y }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={project.cover_image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}
      {/* Dark gradient overlay for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
      <div className="absolute inset-0 bg-black/30" />
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
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) => {
  const start = index / count;
  const end = (index + 1) / count;
  const span = end - start;

  const opacity = useTransform(
    progress,
    [start - span * 0.1, start + span * 0.2, end - span * 0.2, end + span * 0.1],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, end],
    [60, -60]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20 pointer-events-none"
    >
      <div className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono text-[hsl(168_70%_55%)]">
        {project.category || "PROJECT"} · {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </div>

      <h2 className="heading-display text-white font-black leading-[0.9] tracking-[-0.04em] text-[clamp(3rem,12vw,10rem)] max-w-[90vw] break-words drop-shadow-2xl">
        {project.title}
      </h2>

      {project.short_description && (
        <p className="mt-8 max-w-2xl text-base md:text-lg text-white/85 leading-relaxed">
          {project.short_description}
        </p>
      )}

      {project.tools && project.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {project.tools.slice(0, 5).map((tool) => (
            <span
              key={tool}
              className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/30 text-white/90 backdrop-blur-sm bg-white/5"
            >
              {tool}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/portfolio/${project.id}`}
        className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white hover:gap-3 transition-all group pointer-events-auto px-5 py-3 border border-white/40 rounded-full hover:bg-white hover:text-black"
      >
        Открыть проект
        <ArrowUpRight
          size={16}
          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        />
      </Link>
    </motion.div>
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

export default FeaturedProjectsScroll;
