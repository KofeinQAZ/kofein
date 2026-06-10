import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
  // Each project occupies a slice of scroll progress
  const slice = 1 / count;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${count * 110}vh` }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        {/* Animated background blob — moves with scroll */}
        <BackgroundBlob progress={scrollYProgress} />

        {/* Header */}
        <div className="absolute top-8 md:top-12 left-0 right-0 z-20 px-6 md:px-12 max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Featured work
            </p>
            <h2 className="heading-display text-3xl md:text-5xl text-foreground">
              мои проекты<span className="text-primary">.</span>
            </h2>
          </div>
          <ProgressIndicator progress={scrollYProgress} count={count} />
        </div>

        {/* Stack of project cards */}
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              count={count}
              progress={scrollYProgress}
              slice={slice}
            />
          ))}
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            скролл ↓
          </motion.p>
        </div>
      </div>
    </section>
  );
};

const BackgroundBlob = ({ progress }: { progress: MotionValue<number> }) => {
  const x = useTransform(progress, [0, 1], ["-20%", "30%"]);
  const y = useTransform(progress, [0, 1], ["-10%", "20%"]);
  const rotate = useTransform(progress, [0, 1], [0, 180]);
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.3, 0.9]);

  return (
    <motion.div
      style={{ x, y, rotate, scale }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full pointer-events-none"
    >
      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-3xl" />
    </motion.div>
  );
};

const ProgressDot = ({
  progress,
  index,
  count,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
}) => {
  const opacity = useTransform(
    progress,
    [index / count - 0.05, index / count, (index + 1) / count, (index + 1) / count + 0.05],
    [0.3, 1, 1, 0.3]
  );
  return <motion.div style={{ opacity }} className="w-8 h-0.5 bg-foreground" />;
};

const ProgressIndicator = ({
  progress,
  count,
}: {
  progress: MotionValue<number>;
  count: number;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <ProgressDot key={i} progress={progress} index={i} count={count} />
      ))}
    </div>
  );
};

const ProjectCard = ({
  project,
  index,
  count,
  progress,
  slice,
}: {
  project: Project;
  index: number;
  count: number;
  progress: MotionValue<number>;
  slice: number;
}) => {
  const start = index * slice;
  const peak = start + slice * 0.5;
  const end = (index + 1) * slice;

  // Opacity: fade in approaching peak, fade out leaving
  const opacity = useTransform(
    progress,
    [start - slice * 0.3, start + slice * 0.1, end - slice * 0.1, end + slice * 0.3],
    [0, 1, 1, 0]
  );
  // Scale: zoom in slightly then out
  const scale = useTransform(
    progress,
    [start - slice * 0.3, peak, end + slice * 0.3],
    [0.85, 1, 0.85]
  );
  // Y: slide up through center
  const y = useTransform(
    progress,
    [start - slice * 0.3, peak, end + slice * 0.3],
    [80, 0, -80]
  );
  // Image parallax inside card
  const imgY = useTransform(
    progress,
    [start, end],
    ["-8%", "8%"]
  );

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute inset-x-6 md:inset-x-12 max-w-6xl mx-auto top-1/2 -translate-y-1/2"
    >
      <Link
        to={`/portfolio/${project.id}`}
        className="group block rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
      >
        <div className="grid md:grid-cols-2 gap-0 md:min-h-[60vh]">
          {/* Image */}
          <div className="relative overflow-hidden bg-muted aspect-[4/3] md:aspect-auto">
            {project.cover_image ? (
              <motion.img
                src={project.cover_image}
                alt={project.title}
                style={{ y: imgY }}
                className="absolute inset-0 w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Нет изображения
              </div>
            )}
            {/* Index badge */}
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs font-mono tabular-nums text-foreground">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 flex flex-col justify-center gap-4">
            {project.category && (
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
                {project.category}
              </p>
            )}
            <h3 className="heading-display text-3xl md:text-5xl text-foreground leading-tight">
              {project.title}
            </h3>
            {project.short_description && (
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-4">
                {project.short_description}
              </p>
            )}
            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tools.slice(0, 5).map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground rounded-full px-3 py-1"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
            <div className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              открыть проект
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeaturedProjectsScroll;
