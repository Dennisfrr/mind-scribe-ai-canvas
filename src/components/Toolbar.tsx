
import React from 'react';
import { 
  MousePointer, 
  Pen, 
  Type, 
  Circle, 
  Square, 
  Trash2, 
  Sparkles,
  Upload
} from 'lucide-react';

interface ToolbarProps {
  activeTool: 'select' | 'pen' | 'text' | 'shape';
  onToolChange: (tool: 'select' | 'pen' | 'text' | 'shape') => void;
  onAddShape: (type: 'circle' | 'rectangle') => void;
  onClear: () => void;
  onToggleGalaxy: () => void;
  showGalaxy: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  onAddShape,
  onClear,
  onToggleGalaxy,
  showGalaxy
}) => {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Selecionar' },
    { id: 'pen', icon: Pen, label: 'Desenhar' },
    { id: 'text', icon: Type, label: 'Texto' },
  ];

  return (
    <>
      {/* Ferramentas principais */}
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id as any)}
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center transition-all
            ${activeTool === tool.id 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title={tool.label}
        >
          <tool.icon size={20} />
        </button>
      ))}

      {/* Divisor */}
      <div className="w-8 h-px bg-gray-300"></div>

      {/* Formas */}
      <button
        onClick={() => onAddShape('circle')}
        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all"
        title="Adicionar Círculo"
      >
        <Circle size={20} />
      </button>

      <button
        onClick={() => onAddShape('rectangle')}
        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all"
        title="Adicionar Retângulo"
      >
        <Square size={20} />
      </button>

      {/* Divisor */}
      <div className="w-8 h-px bg-gray-300"></div>

      {/* Upload */}
      <button
        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all"
        title="Upload de arquivo"
      >
        <Upload size={20} />
      </button>

      {/* Divisor */}
      <div className="w-8 h-px bg-gray-300"></div>

      {/* Modo Galáxia */}
      <button
        onClick={onToggleGalaxy}
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center transition-all
          ${showGalaxy 
            ? 'bg-purple-500 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
        `}
        title="Modo Galáxia"
      >
        <Sparkles size={20} />
      </button>

      {/* Espaço flexível */}
      <div className="flex-1"></div>

      {/* Limpar */}
      <button
        onClick={onClear}
        className="w-12 h-12 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-all"
        title="Limpar Canvas"
      >
        <Trash2 size={20} />
      </button>
    </>
  );
};
