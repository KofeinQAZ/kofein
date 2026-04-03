import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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
      <h1 className="heading-display text-5xl md:text-7xl text-foreground mb-16">
        Работы
      </h1>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-[4/3] rounded-lg mb-4" />
              <div className="bg-muted h-6 w-2/3 rounded mb-2" />
              <div className="bg-muted h-4 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-lg mb-4 bg-muted">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground">
                    Нет изображения
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="heading-display text-xl text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  {project.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.category}
                    </p>
                  )}
                  {project.short_description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {project.short_description}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            Проекты скоро появятся. Следите за обновлениями!
          </p>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
