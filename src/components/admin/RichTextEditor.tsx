import { useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Link, List, ListOrdered, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
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

  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleUndo = () => execCommand("undo");
  const handleRedo = () => execCommand("redo");
  const handleUL = () => execCommand("insertUnorderedList");
  const handleOL = () => execCommand("insertOrderedList");

  const handleLink = () => {
    const url = prompt("Введите URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "b" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleBold();
    }
    if (e.key === "i" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleItalic();
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30">
        <ToolbarButton onClick={handleBold} title="Жирный (Ctrl+B)">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleItalic} title="Курсив (Ctrl+I)">
          <Italic size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onClick={handleLink} title="Ссылка">
          <Link size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onClick={handleUL} title="Маркированный список">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleOL} title="Нумерованный список">
          <ListOrdered size={14} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onClick={handleUndo} title="Отменить">
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={handleRedo} title="Повторить">
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
