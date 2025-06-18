import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Type
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder,
  minRows = 12 
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertFormatting('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => insertFormatting('*', '*'), label: 'Italic' },
    { icon: Underline, action: () => insertFormatting('_', '_'), label: 'Underline' },
    { icon: List, action: () => insertFormatting('\n- ', ''), label: 'Bullet List' },
    { icon: ListOrdered, action: () => insertFormatting('\n1. ', ''), label: 'Numbered List' },
    { icon: Quote, action: () => insertFormatting('\n> ', ''), label: 'Quote' },
    { icon: Type, action: () => insertFormatting('\n## ', ''), label: 'Heading' },
  ];

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<u>$1</u>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {formatButtons.map((button, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              className="p-2 text-gray-600 hover:bg-gray-100"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="text-gray-600 hover:bg-gray-100"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div 
          className="p-4 min-h-[200px] rich-text-content"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          className="border-0 focus:ring-0 resize-none"
        />
      )}
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
        Word count: {value.trim().split(/\s+/).filter(word => word).length} | 
        Reading time: ~{Math.ceil(value.trim().split(/\s+/).length / 200)} min
      </div>
    </div>
  );
}
