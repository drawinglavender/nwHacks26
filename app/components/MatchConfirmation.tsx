import React from 'react';
import { Screen } from '../page';
import { Heart } from 'lucide-react';

interface MatchConfirmationProps {
  onNavigate: (screen: Screen) => void;
  otherSoulColor: { from: string; to: string };
  onContinueChat: () => void;
}

export function MatchConfirmation({ onNavigate, otherSoulColor, onContinueChat }: MatchConfirmationProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 pt-20 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Soul color visualization */}
        <div className="relative mb-12">
          <div
            className="w-32 h-32 rounded-full mx-auto shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${otherSoulColor.from} 0%, ${otherSoulColor.to} 100%)`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-[#3D3D3D] fill-[#3D3D3D]" />
          </div>
        </div>
        
        <h2 className="text-3xl mb-3">
          It's a match
        </h2>
        
        <p className="text-[#6B6B6B] text-base max-w-[280px] leading-relaxed">
          You both want to keep talking. The conversation will continue with no time limit.
        </p>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={onContinueChat}
          className="w-full py-5 bg-[#3D3D3D] text-white rounded-full text-lg hover:bg-[#2D2D2D] transition-all"
        >
          Continue conversation
        </button>
        
        <p className="text-xs text-[#9B9B9B] text-center leading-relaxed">
          More of your onboarding answers will be revealed as you continue talking
        </p>
      </div>
    </div>
  );
}
