
import React, { useState, useRef } from 'react';
import { X, Move, MessageSquare, Brain } from 'lucide-react';
import { CanvasCard } from './Canvas';

interface CardProps {
  card: CanvasCard;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

export const Card: React.FC<CardProps> = ({ card, onMove, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    onMove(card.id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={cardRef}
      className={`
        absolute bg-white rounded-lg shadow-lg border-2 p-4 max-w-xs z-10 transition-all
        ${card.type === 'ai' ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}
        ${isDragging ? 'cursor-grabbing shadow-xl scale-105' : 'cursor-grab'}
      `}
      style={{
        left: card.position.x,
        top: card.position.y,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {card.type === 'ai' ? (
            <Brain className="w-4 h-4 text-blue-500" />
          ) : (
            <MessageSquare className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-xs font-medium text-gray-600">
            {card.type === 'ai' ? 'IA' : 'Você'}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Move className="w-3 h-3 text-gray-400" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <p className={`text-sm leading-relaxed ${
        card.type === 'ai' ? 'text-blue-900' : 'text-gray-700'
      }`}>
        {card.content}
      </p>

      {/* Pontos de conexão */}
      <div className="absolute w-2 h-2 bg-gray-400 rounded-full -top-1 left-1/2 transform -translate-x-1/2"></div>
      <div className="absolute w-2 h-2 bg-gray-400 rounded-full -bottom-1 left-1/2 transform -translate-x-1/2"></div>
      <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-1 top-1/2 transform -translate-y-1/2"></div>
      <div className="absolute w-2 h-2 bg-gray-400 rounded-full -right-1 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};
