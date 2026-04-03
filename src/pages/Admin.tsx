import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Image, X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Проект удалён");
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="heading-display text-3xl text-foreground">Админ-панель</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setCreating(true); setEditing(null); }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Добавить
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} /> Выйти
          </button>
        </div>
      </div>

      {(creating || editing) && (
        <ProjectForm
          project={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
          }}
        />
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 border border-border rounded-lg"
            >
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.title}
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                  <Image size={20} className="text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditing(project); setCreating(false); }}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Удалить проект?")) deleteMutation.mutate(project.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {projects?.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Нет проектов. Нажмите «Добавить» чтобы создать первый.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

// Project form component
const ProjectForm = ({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [title, setTitle] = useState(project?.title || "");
  const [shortDescription, setShortDescription] = useState(project?.short_description || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "");
  const [tools, setTools] = useState(project?.tools?.join(", ") || "");
  const [link, setLink] = useState(project?.link || "");
  const [displayOrder, setDisplayOrder] = useState(project?.display_order || 0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverUrl = project?.cover_image || null;

      // Upload cover if new file selected
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
        display_order: displayOrder,
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

      toast.success(project ? "Проект обновлён" : "Проект создан");
      onSaved();
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Обложка</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Порядок</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full bg-transparent border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1">
            Изображения для галереи
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-primary file:text-primary-foreground"
          />
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
    </div>
  );
};

export default Admin;
