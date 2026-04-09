import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, Image, Mail } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import ProjectForm from "@/components/admin/ProjectForm";
import MessagesPanel from "@/components/admin/MessagesPanel";

type Project = Tables<"projects">;

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"projects" | "messages">("projects");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["admin-unread-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-display text-3xl text-foreground">Админ-панель</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={16} /> Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-8 border-b border-border">
        <button
          onClick={() => setTab("projects")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            tab === "projects"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Проекты
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 inline-flex items-center gap-2 ${
            tab === "messages"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail size={14} />
          Сообщения
          {(unreadCount ?? 0) > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {tab === "messages" && <MessagesPanel />}

      {tab === "projects" && (
        <>
          <div className="flex items-center justify-end mb-6">
            <button
              onClick={() => { setCreating(true); setEditing(null); }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> Добавить
            </button>
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
        </>
      )}
    </section>
  );
};

export default Admin;
