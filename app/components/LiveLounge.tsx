import React, { useState, useEffect } from 'react';
import { Screen, Thought } from '../page';
import { Plus, MessageCircle } from 'lucide-react';

interface LiveLoungeProps {
  userSoulColor: { name: string; from: string; to: string };
  onNavigate: (screen: Screen) => void;
  onSelectThought: (thought: any) => void;
}

const mockThoughts = [
  {
    id: 1,
    text: "Does anyone else feel like they're more themselves online than in person?",
    soulColor: { name: 'Soft Sage', from: '#689F38', to: '#8BC34A' },
    tag: 'Deep',
    timeLeft: 8,
  },
  {
    id: 2,
    text: "What's something small that made you smile today?",
    soulColor: { name: 'Sunlit Amber', from: '#FF6F00', to: '#FFB74D' },
    tag: 'Light',
    timeLeft: 5,
  },
  {
    id: 3,
    text: "I've been thinking about how we define success. Is it something we choose or something that's chosen for us?",
    soulColor: { name: 'Lavender Mist', from: '#7B1FA2', to: '#BA68C8' },
    tag: 'Curious',
    timeLeft: 12,
  },
  {
    id: 4,
    text: "Looking for someone to talk about the quiet moments that matter.",
    soulColor: { name: 'Steel Blue', from: '#1565C0', to: '#2196F3' },
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
    <div className="h-screen w-screen flex flex-col bg-[#FAF9F7]">
      {/* Header */}
      <div className="p-6 lg:p-8 pb-4 lg:pb-6">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl">Live Lounge</h1>
          <button 
            onClick={() => onNavigate('inbox')}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7 text-[#3D3D3D]" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-6 lg:-mx-8 px-6 lg:px-8">
          {['Light', 'Deep', 'Curious'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
              className={`px-5 lg:px-6 py-2 lg:py-3 rounded-full whitespace-nowrap text-sm lg:text-base transition-all ${
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
      <div className="flex-1 overflow-y-auto px-6 lg:px-8 space-y-4 lg:space-y-6 pb-24 lg:pb-32">
        {filteredThoughts.map((thought) => (
          <div
            key={thought.id}
            onClick={() => {
              onSelectThought(thought);
              onNavigate('chat');
            }}
            className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-[#E8E8E8] hover:border-[#C8C8C8] transition-all cursor-pointer max-w-6xl mx-auto"
          >
            <div className="flex items-start gap-4 lg:gap-6 mb-4 lg:mb-6">
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full flex-shrink-0">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${thought.soulColor.to} 0%, ${thought.soulColor.from} 70%, transparent 90%)`,
                    filter: 'blur(1.5px)'
                  }}
                />
                <div 
                  className="absolute inset-1 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 65% 65%, ${thought.soulColor.from} 0%, ${thought.soulColor.to} 60%, transparent 85%)`,
                    filter: 'blur(1px)'
                  }}
                />
                <div 
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${thought.soulColor.to} 0%, ${thought.soulColor.from} 100%)`,
                    filter: 'blur(0.5px)'
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-base lg:text-lg text-[#3D3D3D] leading-relaxed">
                  {thought.text}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm px-3 lg:px-4 py-1 lg:py-2 bg-[#F5F5F5] text-[#6B6B6B] rounded-full">
                {thought.tag}
              </span>
              <span className="text-xs lg:text-sm text-[#9B9B9B]">
                Available
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating action button */}
      <div className="absolute bottom-6 lg:bottom-8 right-6 lg:right-8">
        <button
          onClick={() => onNavigate('create-prompt')}
          className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-[#F3EF81] text-white flex items-center justify-center shadow-xl hover:bg-[#E5D870] transition-all hover:scale-105"
        >
          <Plus className="w-6 h-6 lg:w-9 lg:h-9" />
        </button>
      </div>
    </div>
  );
}
