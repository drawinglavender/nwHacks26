import React, { useState, useEffect } from 'react';
import { Screen } from '../App';
import { Plus, MessageCircle } from 'lucide-react';

interface LiveLoungeProps {
  userSoulColor: { from: string; to: string };
  onNavigate: (screen: Screen) => void;
  onSelectThought: (thought: any) => void;
}

const mockThoughts = [
  {
    id: 1,
    text: "Does anyone else feel like they're more themselves online than in person?",
    soulColor: { from: '#B8D4C4', to: '#9FBFAA' },
    tag: 'Deep',
    timeLeft: 8,
  },
  {
    id: 2,
    text: "What's something small that made you smile today?",
    soulColor: { from: '#E8D4B8', to: '#D4BF9F' },
    tag: 'Light',
    timeLeft: 5,
  },
  {
    id: 3,
    text: "I've been thinking about how we define success. Is it something we choose or something that's chosen for us?",
    soulColor: { from: '#C4B8E8', to: '#A89FD4' },
    tag: 'Curious',
    timeLeft: 12,
  },
  {
    id: 4,
    text: "Looking for someone to talk about the quiet moments that matter.",
    soulColor: { from: '#B8C4E8', to: '#9FA8D4' },
    tag: 'Deep',
    timeLeft: 15,
  },
];

export function LiveLounge({ userSoulColor, onNavigate, onSelectThought }: LiveLoungeProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState(mockThoughts);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughts(prev => prev.map(t => ({
        ...t,
        timeLeft: Math.max(0, t.timeLeft - 1)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const filteredThoughts = activeFilter
    ? thoughts.filter(t => t.tag === activeFilter)
    : thoughts;

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl">Live Lounge</h1>
          <button 
            onClick={() => onNavigate('inbox')}
            className="w-10 h-10 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 text-[#3D3D3D]" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {['Light', 'Deep', 'Curious'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                activeFilter === filter
                  ? 'bg-[#3D3D3D] text-white'
                  : 'bg-white border border-[#E8E8E8] text-[#6B6B6B]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Thoughts feed */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-24">
        {filteredThoughts.map((thought) => (
          <div
            key={thought.id}
            onClick={() => {
              onSelectThought(thought);
              onNavigate('chat');
            }}
            className="bg-white rounded-3xl p-6 border border-[#E8E8E8] hover:border-[#C8C8C8] transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-12 h-12 rounded-full flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${thought.soulColor.from} 0%, ${thought.soulColor.to} 100%)`,
                }}
              />
              <div className="flex-1">
                <p className="text-[#3D3D3D] leading-relaxed">
                  {thought.text}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 bg-[#F5F5F5] text-[#6B6B6B] rounded-full">
                {thought.tag}
              </span>
              <span className="text-xs text-[#9B9B9B]">
                {thought.timeLeft} min left
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating action button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => onNavigate('create-thought')}
          className="w-16 h-16 rounded-full bg-[#3D3D3D] text-white flex items-center justify-center shadow-xl hover:bg-[#2D2D2D] transition-all hover:scale-105"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
