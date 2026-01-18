import React, { useState } from 'react';
import { Screen } from '../App';
import { ChevronRight } from 'lucide-react';
import { createUser } from '@/src/services/users';

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length >= 10) {
      onNavigate('onboarding-fixed');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 pt-20 pb-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <div className="mb-12">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, #E8C4B8 0%, #D4A89F 50%, #B8C4E8 100%)',
              filter: 'blur(20px)',
              opacity: 0.6
            }}
          />
        </div>
        
        <h1 className="text-4xl mb-4 tracking-tight">
          Soul Talk
        </h1>
        
        <p className="text-[#6B6B6B] text-base max-w-[280px] leading-relaxed mb-12">
          Connect through thoughts, not profiles.
        </p>

        <div className="w-full">
          <label className="text-sm text-[#6B6B6B] mb-3 block text-left">
            Enter your phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="(555) 123-4567"
            className="w-full px-5 py-4 bg-white rounded-2xl border border-[#E8E8E8] focus:outline-none focus:border-[#3D3D3D] transition-colors text-[#3D3D3D] placeholder:text-[#BEBEBE] text-center text-lg"
            maxLength={10}
            autoFocus
          />
          <p className="text-xs text-[#9B9B9B] mt-3 text-center">
            We'll send you a verification code
          </p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={phoneNumber.length < 10}
        className="w-full py-4 bg-[#3D3D3D] text-white rounded-full text-lg hover:bg-[#2D2D2D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continue
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
