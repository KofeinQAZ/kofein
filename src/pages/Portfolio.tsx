import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const Portfolio = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <motion.div
        className="flex items-center gap-3 mb-16"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="heading-display text-4xl md:text-5xl text-foreground">
          Selected work
        </h1>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={24} className="text-foreground mt-2" />
        </motion.div>
      </motion.div>

      {isLoading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse break-inside-avoid">
              <div className="bg-muted rounded-lg aspect-[4/3] mb-3" />
              <div className="bg-muted h-5 w-2/3 rounded mb-1" />
              <div className="bg-muted h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="break-inside-avoid"
            >
              <Link
                to={`/portfolio/${project.id}`}
                className="group block"
              >
                <motion.div
                  className="overflow-hidden rounded-lg bg-muted"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      Нет изображения
                    </div>
                  )}
                </motion.div>
                <div className="mt-3 mb-2">
                  <h2 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  {project.short_description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {project.short_description}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground text-lg">
            Проекты скоро появятся. Следите за обновлениями!
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default Portfolio;
