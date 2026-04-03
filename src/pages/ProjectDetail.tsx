import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: images } = useQuery({
    queryKey: ["project-images", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id!)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="bg-muted h-8 w-32 rounded" />
          <div className="bg-muted h-12 w-2/3 rounded" />
          <div className="bg-muted aspect-video rounded-lg" />
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto text-center">
        <p className="text-muted-foreground text-lg">Проект не найден</p>
        <Link to="/portfolio" className="text-primary hover:underline mt-4 inline-block">
          ← Назад к работам
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
      >
        <ArrowLeft size={16} />
        Назад к работам
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="heading-display text-4xl md:text-6xl text-foreground">
            {project.title}
          </h1>
          {project.category && (
            <p className="text-primary text-sm uppercase tracking-widest">
              {project.category}
            </p>
          )}
        </div>

        {/* Cover */}
        {project.cover_image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        )}

        {/* Tools */}
        {project.tools && project.tools.length > 0 && (
          <div>
            <h2 className="heading-display text-sm uppercase tracking-widest text-primary mb-4">
              Инструменты
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-sm border border-border rounded-full px-4 py-2 text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Открыть проект <ExternalLink size={16} />
          </a>
        )}

        {/* Gallery */}
        {images && images.length > 0 && (
          <div>
            <h2 className="heading-display text-sm uppercase tracking-widest text-primary mb-6">
              Галерея
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.caption || project.title}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                  {img.caption && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectDetail;
