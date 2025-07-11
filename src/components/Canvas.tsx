import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, IText, Circle, Rect, Line } from 'fabric';
import { useSpring, animated } from 'react-spring';
import { Toolbar } from './Toolbar';
import { AIPanel } from './AIPanel';
import { Card } from './Card';
import { GalaxyView } from './GalaxyView';
import { toast } from 'sonner';

export interface CanvasCard {
  id: string;
  content: string;
  position: { x: number; y: number };
  type: 'user' | 'ai';
  connections: string[];
}

export interface AIIdea {
  id: string;
  content: string;
  trigger: string;
  position: { x: number; y: number };
}

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pen' | 'text' | 'shape'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [cards, setCards] = useState<CanvasCard[]>([]);
  const [aiIdeas, setAiIdeas] = useState<AIIdea[]>([]);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState<any[]>([]);

  // Animação para transição entre modos
  const canvasSpring = useSpring({
    opacity: showGalaxy ? 0.3 : 1,
    transform: showGalaxy ? 'scale(0.8)' : 'scale(1)',
    config: { tension: 200, friction: 25 }
  });

  // Inicializar o canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 400,
      height: window.innerHeight,
      backgroundColor: '#ffffff',
      selection: activeTool === 'select'
    });

    // Configurar brush para desenho - verificar se existe primeiro
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#2563eb';
      canvas.freeDrawingBrush.width = 3;
    }

    setFabricCanvas(canvas);

    // Event listeners
    canvas.on('path:created', handlePathCreated);
    canvas.on('text:editing:exited', handleTextCreated);
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedObjects([]));

    return () => {
      canvas.dispose();
    };
  }, []);

  // Atualizar modo do canvas baseado na ferramenta ativa
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'pen';
    fabricCanvas.selection = activeTool === 'select';
    
    // Configurar brush apenas se estiver em modo desenho e o brush existir
    if (activeTool === 'pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = '#2563eb';
      fabricCanvas.freeDrawingBrush.width = 3;
      fabricCanvas.defaultCursor = 'crosshair';
    } else {
      fabricCanvas.defaultCursor = 'default';
    }
  }, [activeTool, fabricCanvas]);

  const handlePathCreated = useCallback((e: any) => {
    const path = e.path;
    
    // Simular IA detectando um desenho
    setTimeout(() => {
      generateAIIdea(`Desenho criado na posição ${path.left}, ${path.top}`, {
        x: path.left + 100,
        y: path.top
      });
    }, 500);
  }, []);

  const handleTextCreated = useCallback((e: any) => {
    const text = e.target.text;
    
    if (text && text.length > 3) {
      setTimeout(() => {
        generateAIIdea(`Texto: "${text}"`, {
          x: e.target.left + 200,
          y: e.target.top
        });
      }, 1000);
    }
  }, []);

  const handleSelection = useCallback((e: any) => {
    setSelectedObjects(e.selected || []);
  }, []);

  const generateAIIdea = (trigger: string, position: { x: number; y: number }) => {
    const responses = [
      "Que tal expandir isso com exemplos práticos?",
      "Isso me lembra de conectar com tendências atuais",
      "Vejo potencial para uma abordagem disruptiva aqui",
      "E se combinarmos com tecnologia emergente?",
      "Posso ajudar a estruturar isso em um framework",
      "Interessante! Vamos explorar os prós e contras?",
      "Isso tem potencial para virar um MVP rápido"
    ];

    const newIdea: AIIdea = {
      id: Date.now().toString(),
      content: responses[Math.floor(Math.random() * responses.length)],
      trigger,
      position
    };

    setAiIdeas(prev => [...prev, newIdea]);

    // Remover a ideia após 10 segundos se não for interagida
    setTimeout(() => {
      setAiIdeas(prev => prev.filter(idea => idea.id !== newIdea.id));
    }, 10000);
  };

  const addTextToCanvas = (text: string, x: number, y: number) => {
    if (!fabricCanvas) return;

    const textObj = new IText(text, {
      left: x,
      top: y,
      fontSize: 16,
      fill: '#1f2937',
      fontFamily: 'Inter, system-ui, sans-serif'
    });

    fabricCanvas.add(textObj);
    fabricCanvas.setActiveObject(textObj);
    textObj.enterEditing();
  };

  const addShape = (type: 'circle' | 'rectangle') => {
    if (!fabricCanvas) return;

    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;

    if (type === 'circle') {
      const circle = new Circle({
        left: centerX - 50,
        top: centerY - 50,
        radius: 50,
        fill: 'transparent',
        stroke: '#2563eb',
        strokeWidth: 2
      });
      fabricCanvas.add(circle);
    } else {
      const rect = new Rect({
        left: centerX - 75,
        top: centerY - 50,
        width: 150,
        height: 100,
        fill: 'transparent',
        stroke: '#2563eb',
        strokeWidth: 2
      });
      fabricCanvas.add(rect);
    }
  };

  const handleToolChange = (tool: typeof activeTool) => {
    setActiveTool(tool);
    
    if (tool === 'text') {
      // Adicionar texto no meio do canvas
      const centerX = fabricCanvas?.width! / 2 || 400;
      const centerY = fabricCanvas?.height! / 2 || 300;
      addTextToCanvas('Digite aqui...', centerX - 50, centerY);
      setActiveTool('select');
    }
  };

  const acceptAIIdea = (idea: AIIdea) => {
    const newCard: CanvasCard = {
      id: Date.now().toString(),
      content: idea.content,
      position: idea.position,
      type: 'ai',
      connections: []
    };

    setCards(prev => [...prev, newCard]);
    setAiIdeas(prev => prev.filter(i => i.id !== idea.id));
    toast("Ideia da IA adicionada!");
  };

  const dismissAIIdea = (ideaId: string) => {
    setAiIdeas(prev => prev.filter(i => i.id !== ideaId));
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    setCards([]);
    setAiIdeas([]);
    toast("Canvas limpo!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toolbar Lateral */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 z-10">
        <Toolbar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onAddShape={addShape}
          onClear={clearCanvas}
          onToggleGalaxy={() => setShowGalaxy(!showGalaxy)}
          showGalaxy={showGalaxy}
        />
      </div>

      {/* Canvas Principal */}
      <div className="flex-1 relative overflow-hidden">
        <animated.div style={canvasSpring} className="absolute inset-0">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ imageRendering: 'pixelated' }}
          />
        </animated.div>

        {/* Cards Flutuantes */}
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onMove={(id, position) => {
              setCards(prev => prev.map(c => 
                c.id === id ? { ...c, position } : c
              ));
            }}
            onDelete={(id) => {
              setCards(prev => prev.filter(c => c.id !== id));
            }}
          />
        ))}

        {/* Ideias da IA */}
        {aiIdeas.map(idea => (
          <div
            key={idea.id}
            className="absolute bg-blue-500 text-white p-3 rounded-lg shadow-lg max-w-xs z-20 animate-pulse"
            style={{
              left: idea.position.x,
              top: idea.position.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <p className="text-sm mb-2">{idea.content}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => acceptAIIdea(idea)}
                className="bg-white text-blue-500 px-2 py-1 rounded text-xs hover:bg-gray-100"
              >
                Aceitar
              </button>
              <button
                onClick={() => dismissAIIdea(idea.id)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
              >
                Dispensar
              </button>
            </div>
          </div>
        ))}

        {/* Modo Galáxia */}
        {showGalaxy && (
          <GalaxyView
            cards={cards}
            onClose={() => setShowGalaxy(false)}
          />
        )}
      </div>

      {/* Painel IA */}
      <div className="w-80 bg-white border-l border-gray-200">
        <AIPanel
          selectedObjects={selectedObjects}
          onAddCard={(content) => {
            const newCard: CanvasCard = {
              id: Date.now().toString(),
              content,
              position: { x: 400, y: 200 },
              type: 'ai',
              connections: []
            };
            setCards(prev => [...prev, newCard]);
          }}
          recentCards={cards.slice(-5)}
        />
      </div>
    </div>
  );
};
