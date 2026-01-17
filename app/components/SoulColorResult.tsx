import React from 'react';
import { Screen } from '../page';

interface SoulColorResultProps {
  soulColor: { from: string; to: string };
  onNavigate: (screen: Screen) => void;
}

const descriptions = [
  "Thoughtful and grounded",
  "Curious and open-minded",
  "Reflective and empathetic",
  "Warm and authentic",
  "Calm and intentional",
];

export function SoulColorResult({ soulColor, onNavigate }: SoulColorResultProps) {
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 pt-20 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <p className="text-sm text-[#9B9B9B] mb-4">Your Soul Color</p>
          
          <div 
            className="w-48 h-48 rounded-full mx-auto mb-8 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${soulColor.from} 0%, ${soulColor.to} 100%)`,
            }}
          />
        </div>
        
        <h2 className="text-2xl mb-3">
          {description}
        </h2>
        
        <p className="text-[#6B6B6B] text-base max-w-[280px] leading-relaxed">
          This color represents your conversation energy. It's your identity here—no photos, no profiles.
        </p>
      </div>

      <button
        onClick={() => onNavigate('create-prompt')}
        className="w-full py-4 bg-[#3D3D3D] text-white rounded-full text-lg hover:bg-[#2D2D2D] transition-colors"
      >
        Start a conversation
      </button>
    </div>
  );
}