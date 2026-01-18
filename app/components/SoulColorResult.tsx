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
    <div className="h-screen w-screen flex flex-col items-center justify-between p-6 lg:p-12 pt-12 lg:pt-24 pb-6 lg:pb-16">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-12 lg:mb-16">
          <p className="text-base lg:text-lg text-[#9B9B9B] mb-4 lg:mb-6">Your Soul Color</p>
          
          <div 
            className="w-48 h-48 lg:w-64 lg:h-64 rounded-full mx-auto mb-8 lg:mb-12 shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${soulColor.from} 0%, ${soulColor.to} 100%)`,
            }}
          />
        </div>
        
        <h2 className="text-3xl lg:text-4xl mb-4 lg:mb-6">
          {description}
        </h2>
        
        <p className="text-[#6B6B6B] text-base lg:text-lg max-w-2xl lg:max-w-3xl leading-relaxed">
          This color represents your conversation energy. It&apos;s your identity here—no photos, no profiles.
        </p>
      </div>

      <button
        onClick={() => onNavigate('create-prompt')}
        className="w-full max-w-lg lg:max-w-xl py-4 lg:py-5 bg-[#3D3D3D] text-white rounded-full text-lg lg:text-xl hover:bg-[#2D2D2D] transition-colors"
      >
        Start a conversation
      </button>
    </div>
  );
}