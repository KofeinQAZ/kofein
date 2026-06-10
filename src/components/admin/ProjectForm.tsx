import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import BlockEditor from "./BlockEditor";

type Project = Tables<"projects">;

const ProjectForm = ({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(project?.title || "");
  const [shortDescription, setShortDescription] = useState(project?.short_description || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "");
  const [tools, setTools] = useState(project?.tools?.join(", ") || "");
  const [link, setLink] = useState(project?.link || "");
  const [isFeatured, setIsFeatured] = useState<boolean>((project as any)?.is_featured ?? false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(project?.id || null);

  // Fetch existing gallery images when editing
  const { data: existingImages } = useQuery({
    queryKey: ["admin-project-images", project?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", project!.id)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!project?.id,
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase.from("project_images").delete().eq("id", imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-project-images", project?.id] });
      toast.success("Изображение удалено");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverUrl = project?.cover_image || null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(path, coverFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(path);
        coverUrl = urlData.publicUrl;
      }

      const projectData = {
        title,
        short_description: shortDescription || null,
        description: description || null,
        category: category || null,
        cover_image: coverUrl,
        tools: tools ? tools.split(",").map((t) => t.trim()) : [],
        link: link || null,
      };

      let projectId = project?.id;

      if (project) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select("id")
          .single();
        if (error) throw error;
        projectId = data.id;
        setSavedProjectId(data.id);
      }

      // Upload gallery images
      if (galleryFiles.length > 0 && projectId) {
        for (const file of galleryFiles) {
          const ext = file.name.split(".").pop();
          const path = `gallery/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("project-images")
            .upload(path, file);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage
            .from("project-images")
            .getPublicUrl(path);

          await supabase.from("project_images").insert({
            project_id: projectId,
            image_url: urlData.publicUrl,
          });
        }
      }

      toast.success(project ? "Проект обновлён" : "Проект создан. Теперь можно добавить блоки контента.");
      if (project) {
        onSaved();
      }
      // For new projects, keep form open so user can add blocks
    } catch (err: any) {
      toast.error("Ошибка: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-12 border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-display text-xl text-foreground">
          {project ? "Редактировать проект" : "Новый проект"}
        </h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Название *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Категория</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={100}
              className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              placeholder="Branding, UI/UX, etc."
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Краткое описание</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            maxLength={300}
            className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Полное описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Инструменты (через запятую)
            </label>
            <input
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              placeholder="Figma, Photoshop, After Effects"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Ссылка</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="url"
              className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">Обложка</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground"
          />
        </div>

        {existingImages && existingImages.length > 0 && (
          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Текущие изображения ({existingImages.length})
            </label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.image_url}
                    alt={img.caption || "Gallery"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Удалить это изображение?")) {
                        deleteImageMutation.mutate(img.id);
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground block mb-1">
            Добавить изображения в галерею
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground"
          />
          {galleryFiles.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Выбрано файлов: {galleryFiles.length}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Сохранение..." : project ? "Сохранить" : "Создать"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>

      {(project?.id || savedProjectId) && (
        <div className="mt-8 pt-6 border-t border-border">
          <BlockEditor projectId={(project?.id || savedProjectId)!} />
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
