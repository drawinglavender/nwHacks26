import React, { useState } from 'react';
import { Screen } from '../page';

interface TimeLimitFeedbackProps {
  onNavigate: (screen: Screen) => void;
  onContinue: (userWantsToContinue: boolean) => void;
}

export function TimeLimitFeedback({ onNavigate, onContinue }: TimeLimitFeedbackProps) {
  const [isWaiting, setIsWaiting] = useState(false);

  const handleChoice = (wantToContinue: boolean) => {
    setIsWaiting(true);
    
    // Simulate waiting for other user's response
    setTimeout(() => {
      onContinue(wantToContinue);
    }, 1500);
  };

  if (isWaiting) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 border-4 border-[#E8E8E8] border-t-[#3D3D3D] rounded-full animate-spin mx-auto" />
        </div>
        <p className="text-lg text-[#6B6B6B]">
          Waiting for their response...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 pt-20 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-8 flex items-center justify-center border border-[#E8E8E8]">
          <span className="text-4xl">⏱️</span>
        </div>
        
        <h2 className="text-2xl mb-3">
          Time's up
        </h2>
        
        <p className="text-[#6B6B6B] text-base max-w-[280px] leading-relaxed mb-12">
          You've reached the end of your session. Want to keep talking with this person?
        </p>

        <div className="w-full space-y-4">
          <button
            onClick={() => handleChoice(true)}
            className="w-full py-5 bg-[#3D3D3D] text-white rounded-full text-lg hover:bg-[#2D2D2D] transition-all"
          >
            Yes, keep talking
          </button>
          
          <button
            onClick={() => handleChoice(false)}
            className="w-full py-5 bg-white border-2 border-[#E8E8E8] text-[#6B6B6B] rounded-full text-lg hover:bg-[#F5F5F5] transition-all"
          >
            No, end conversation
          </button>
        </div>
      </div>

      <p className="text-xs text-[#9B9B9B] text-center">
        Both people must agree to continue
      </p>
    </div>
  );
}
