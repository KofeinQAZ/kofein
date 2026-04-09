import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const MessagesPanel = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Сообщение удалено");
    },
  });

  const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

  if (isLoading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <p className="text-sm text-primary font-medium">
          Непрочитанных: {unreadCount}
        </p>
      )}

      {messages?.length === 0 && (
        <p className="text-muted-foreground text-center py-8">Нет сообщений</p>
      )}

      {messages?.map((msg) => (
        <div
          key={msg.id}
          className={`border rounded-lg transition-colors ${
            msg.is_read ? "border-border" : "border-primary/50 bg-primary/5"
          }`}
        >
          <div
            className="flex items-center gap-3 p-4 cursor-pointer"
            onClick={() => {
              setExpandedId(expandedId === msg.id ? null : msg.id);
              if (!msg.is_read) {
                markReadMutation.mutate({ id: msg.id, is_read: true });
              }
            }}
          >
            {msg.is_read ? (
              <MailOpen size={18} className="text-muted-foreground flex-shrink-0" />
            ) : (
              <Mail size={18} className="text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground truncate">{msg.name}</span>
                <span className="text-xs text-muted-foreground">{msg.email}</span>
              </div>
              {msg.subject && (
                <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(msg.created_at).toLocaleDateString("ru-RU")}
            </span>
            {expandedId === msg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {expandedId === msg.id && (
            <div className="px-4 pb-4 border-t border-border pt-3">
              <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {msg.message}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => markReadMutation.mutate({ id: msg.id, is_read: !msg.is_read })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {msg.is_read ? "Отметить непрочитанным" : "Отметить прочитанным"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Удалить сообщение?")) deleteMutation.mutate(msg.id);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 size={12} /> Удалить
                </button>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-xs text-primary hover:underline ml-auto"
                >
                  Ответить
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessagesPanel;
