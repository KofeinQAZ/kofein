import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";

type BlockType = "heading" | "paragraph" | "image" | "youtube" | "quote";

interface Block {
  id?: string;
  block_type: BlockType;
  content: string;
  image_url: string;
  display_order: number;
  isNew?: boolean;
}

const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Заголовок",
  paragraph: "Параграф",
  image: "Изображение",
  youtube: "YouTube видео",
  quote: "Цитата",
};

const BlockEditor = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: existingBlocks, isLoading } = useQuery({
    queryKey: ["project-blocks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_blocks")
        .select("*")
        .eq("project_id", projectId)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (existingBlocks) {
      setBlocks(
        existingBlocks.map((b) => ({
          id: b.id,
          block_type: b.block_type as BlockType,
          content: b.content || "",
          image_url: b.image_url || "",
          display_order: b.display_order,
        }))
      );
    }
  }, [existingBlocks]);

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [
      ...prev,
      {
        block_type: type,
        content: "",
        image_url: "",
        display_order: prev.length,
        isNew: true,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    const block = blocks[index];
    if (block.id) {
      // Delete from DB
      supabase
        .from("project_blocks")
        .delete()
        .eq("id", block.id)
        .then(({ error }) => {
          if (error) toast.error("Ошибка удаления");
          else {
            queryClient.invalidateQueries({ queryKey: ["project-blocks", projectId] });
            toast.success("Блок удалён");
          }
        });
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBlocks(updated.map((b, i) => ({ ...b, display_order: i })));
  };

  const updateBlock = (index: number, field: keyof Block, value: string) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const handleImageUpload = async (index: number, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `blocks/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) {
      toast.error("Ошибка загрузки");
      return;
    }
    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(path);
    updateBlock(index, "image_url", urlData.publicUrl);
  };

  const saveBlocks = async () => {
    setSaving(true);
    try {
      // Delete all existing blocks for this project, then re-insert
      await supabase.from("project_blocks").delete().eq("project_id", projectId);

      if (blocks.length > 0) {
        const { error } = await supabase.from("project_blocks").insert(
          blocks.map((b, i) => ({
            project_id: projectId,
            block_type: b.block_type,
            content: b.content || null,
            image_url: b.image_url || null,
            display_order: i,
          }))
        );
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["project-blocks", projectId] });
      toast.success("Блоки сохранены");
    } catch (err: any) {
      toast.error("Ошибка: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Загрузка блоков...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Блоки контента</h3>
        <button
          type="button"
          onClick={saveBlocks}
          disabled={saving}
          className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Сохранение..." : "Сохранить блоки"}
        </button>
      </div>

      {blocks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Нет блоков. Добавьте первый блок ниже.
        </p>
      )}

      {blocks.map((block, index) => (
        <div key={index} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <GripVertical size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {BLOCK_LABELS[block.block_type]}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => moveBlock(index, -1)}
                disabled={index === 0}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 1)}
                disabled={index === blocks.length - 1}
                className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {(block.block_type === "heading" || block.block_type === "quote") && (
            <input
              value={block.content}
              onChange={(e) => updateBlock(index, "content", e.target.value)}
              placeholder={block.block_type === "heading" ? "Текст заголовка..." : "Текст цитаты..."}
              className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          )}

          {block.block_type === "paragraph" && (
            <RichTextEditor
              value={block.content}
              onChange={(val) => updateBlock(index, "content", val)}
              placeholder="Начните писать текст..."
            />
          )}

          {block.block_type === "image" && (
            <div className="space-y-2">
              {block.image_url && (
                <img src={block.image_url} alt="" className="w-full max-h-48 object-cover rounded-lg" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(index, file);
                }}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-primary file:text-primary-foreground"
              />
              <input
                value={block.content}
                onChange={(e) => updateBlock(index, "content", e.target.value)}
                placeholder="Подпись к изображению (необязательно)"
                className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {block.block_type === "youtube" && (
            <input
              value={block.content}
              onChange={(e) => updateBlock(index, "content", e.target.value)}
              placeholder="Ссылка на YouTube видео (https://youtube.com/watch?v=...)"
              className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          )}
        </div>
      ))}

      {/* Add block buttons */}
      <div className="flex flex-wrap gap-2 pt-2">
        {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addBlock(type)}
            className="inline-flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <Plus size={12} />
            {BLOCK_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlockEditor;
