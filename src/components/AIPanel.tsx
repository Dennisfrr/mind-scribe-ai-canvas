
import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { CanvasCard } from './Canvas';

interface AIPanelProps {
  selectedObjects: any[];
  onAddCard: (content: string) => void;
  recentCards: CanvasCard[];
}

export const AIPanel: React.FC<AIPanelProps> = ({
  selectedObjects,
  onAddCard,
  recentCards
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Sugestões baseadas em contexto
  const contextSuggestions = [
    "Que tal estruturar isso em um mind map?",
    "Posso ajudar a criar um framework para essa ideia",
    "Vamos explorar os prós e contras?",
    "E se transformássemos isso em uma lista de ação?",
    "Que tal adicionar métricas para medir o sucesso?",
    "Posso sugerir algumas referências similares",
    "Vamos pensar em possíveis obstáculos?",
    "E se expandíssemos para diferentes cenários?"
  ];

  const provocativeQuestions = [
    "🤔 E se fosse o contrário?",
    "🎯 Qual seria o MVP mais simples?",
    "🚀 Como isso escala para 1 milhão de usuários?",
    "💡 Que problema isso realmente resolve?",
    "🔥 Qual seria a versão disruptiva?",
    "⚡ Como reduzir isso para 10% do esforço?",
    "🌟 Que tal combinar com IA?",
    "🎨 E se fosse gamificado?"
  ];

  // Atualizar sugestões quando objetos são selecionados
  useEffect(() => {
    if (selectedObjects.length > 0) {
      setIsThinking(true);
      
      setTimeout(() => {
        const randomSuggestions = contextSuggestions
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setSuggestions(randomSuggestions);
        setIsThinking(false);
      }, 1000);
    } else {
      setSuggestions([]);
    }
  }, [selectedObjects]);

  const handleAddSuggestion = (suggestion: string) => {
    onAddCard(suggestion);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">IA Copiloto</h2>
            <p className="text-xs text-gray-500">Expandindo suas ideias</p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Sugestões baseadas em seleção */}
        {selectedObjects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <h3 className="font-medium text-gray-900">Para sua seleção</h3>
            </div>
            
            {isThinking ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 p-3 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-200 p-3 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer group"
                    onClick={() => handleAddSuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-blue-900 flex-1">{suggestion}</p>
                      <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Perguntas provocativas */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="font-medium text-gray-900">Perguntas Provocativas</h3>
          </div>
          
          <div className="space-y-2">
            {provocativeQuestions.slice(0, 4).map((question, index) => (
              <div
                key={index}
                className="bg-amber-50 border border-amber-200 p-3 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer group"
                onClick={() => onAddCard(question)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-amber-900">{question}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cards recentes */}
        {recentCards.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="font-medium text-gray-900">Ideias Recentes</h3>
            </div>
            
            <div className="space-y-2">
              {recentCards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-purple-50 border border-purple-200 p-3 rounded-lg"
                >
                  <p className="text-sm text-purple-900 line-clamp-2">
                    {card.content}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      card.type === 'ai' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs text-purple-600">
                      {card.type === 'ai' ? 'IA' : 'Você'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {selectedObjects.length === 0 && recentCards.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Comece a desenhar ou escrever na lousa para ver sugestões da IA
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
