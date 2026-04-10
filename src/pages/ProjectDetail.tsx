import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const extractYoutubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  );
  return match ? match[1] : null;
};

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

  const { data: blocks } = useQuery({
    queryKey: ["project-blocks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_blocks")
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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Назад к работам
        </Link>
      </motion.div>

      {/* Header */}
      <div className="grid md:grid-cols-[1fr_2fr] gap-8 mb-12">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="heading-display text-3xl md:text-4xl text-foreground">
            {project.title}
          </h1>
          {project.category && (
            <p className="text-primary text-sm uppercase tracking-widest">
              {project.category}
            </p>
          )}
          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tools.map((tool, i) => (
                <motion.span
                  key={tool}
                  className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4"
            >
              Открыть проект <ExternalLink size={14} />
            </a>
          )}
        </motion.div>
        {project.description && (
          <motion.p
            className="text-base text-muted-foreground leading-relaxed whitespace-pre-line pt-1"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {project.description}
          </motion.p>
        )}
      </div>

      {/* Content blocks */}
      {blocks && blocks.length > 0 && (
        <div className="space-y-8 mb-12">
          {blocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              {block.block_type === "heading" && (
                <h2 className="heading-display text-2xl md:text-3xl text-foreground">
                  {block.content}
                </h2>
              )}
              {block.block_type === "paragraph" && block.content && (
                <div
                  className="text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_b]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              )}
              {block.block_type === "image" && block.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={block.image_url}
                    alt={block.content || project.title}
                    className="w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {block.content && (
                    <p className="text-sm text-muted-foreground mt-2">{block.content}</p>
                  )}
                </div>
              )}
              {block.block_type === "youtube" && block.content && (() => {
                const videoId = extractYoutubeId(block.content);
                if (!videoId) return null;
                return (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video"
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                );
              })()}
              {block.block_type === "quote" && (
                <blockquote className="border-l-4 border-primary pl-6 py-2 text-lg text-foreground italic">
                  {block.content}
                </blockquote>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Images */}
      <div className="space-y-4">
        {project.cover_image && (
          <motion.div
            className="rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        )}
        {images && images.map((img, i) => (
          <motion.div
            key={img.id}
            className="rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <img
              src={img.image_url}
              alt={img.caption || project.title}
              className="w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {img.caption && (
              <p className="text-sm text-muted-foreground mt-2">{img.caption}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ProjectDetail;
