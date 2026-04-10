import { useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Link, List, ListOrdered, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onMouseDown,
  title,
  children,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={onMouseDown}
    title={title}
    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = (e: React.MouseEvent, command: string, val?: string) => {
    e.preventDefault(); // prevent blur / selection loss
    document.execCommand(command, false, val);
    handleInput();
  };

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = prompt("Введите URL:");
    if (url) {
      document.execCommand("createLink", false, url);
      handleInput();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.execCommand("bold");
      handleInput();
    }
    if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      document.execCommand("italic");
      handleInput();
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
        <ToolbarButton onMouseDown={(e) => execCommand(e, "bold")} title="Жирный (Ctrl+B)">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onMouseDown={(e) => execCommand(e, "italic")} title="Курсив (Ctrl+I)">
          <Italic size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onMouseDown={handleLink} title="Ссылка">
          <Link size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onMouseDown={(e) => execCommand(e, "insertUnorderedList")} title="Маркированный список">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onMouseDown={(e) => execCommand(e, "insertOrderedList")} title="Нумерованный список">
          <ListOrdered size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onMouseDown={(e) => execCommand(e, "undo")} title="Отменить">
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton onMouseDown={(e) => execCommand(e, "redo")} title="Повторить">
          <Redo size={14} />
        </ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="min-h-[120px] px-3 py-2 text-sm text-foreground focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
};

export default RichTextEditor;
