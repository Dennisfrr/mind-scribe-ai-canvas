
import React, { useEffect, useRef } from 'react';
import { X, Zap } from 'lucide-react';
import { CanvasCard } from './Canvas';

interface GalaxyViewProps {
  cards: CanvasCard[];
  onClose: () => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  content: string;
  type: 'user' | 'ai';
  connections: string[];
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ cards, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar tamanhos
    canvas.width = window.innerWidth - 400;
    canvas.height = window.innerHeight;

    // Converter cards em nós
    const nodes: Node[] = cards.map((card, index) => ({
      id: card.id,
      x: Math.random() * (canvas.width - 200) + 100,
      y: Math.random() * (canvas.height - 200) + 100,
      content: card.content,
      type: card.type,
      connections: card.connections
    }));

    // Sistema de partículas
    const particles: { x: number; y: number; vx: number; vy: number; opacity: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar partículas
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();
      });

      // Desenhar conexões entre nós próximos
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i >= j) return;
          
          const distance = Math.sqrt(
            Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
          );
          
          if (distance < 200) {
            const opacity = 1 - (distance / 200);
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Desenhar nós
      nodes.forEach(node => {
        // Círculo do nó
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'ai' ? '#3b82f6' : '#6b7280';
        ctx.fill();

        // Borda brilhante
        ctx.beginPath();
        ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'ai' ? '#60a5fa' : '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Texto do nó (truncado)
        const truncatedText = node.content.length > 20 
          ? node.content.substring(0, 20) + '...' 
          : node.content;
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(truncatedText, node.x, node.y + 35);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cards]);

  return (
    <div className="absolute inset-0 bg-slate-900 bg-opacity-95 z-30 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Modo Galáxia</h2>
            <p className="text-purple-200 text-sm">Visualização em grafo das suas ideias</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ left: '64px' }}
      />

      {/* Instruções */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm text-white p-4 rounded-lg">
        <p className="text-sm text-center">
          Visualização neural das suas ideias • Nós conectados representam conceitos relacionados
        </p>
      </div>
    </div>
  );
};
