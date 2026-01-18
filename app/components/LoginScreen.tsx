import React, { useState } from 'react';
import { Screen } from '../page';
import { ChevronRight } from 'lucide-react';

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
    <div className="h-screen w-screen flex flex-col items-center justify-between p-8 pt-16 pb-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl">
        <div className="mb-16">
          <div 
            className="w-32 h-32 rounded-full mx-auto mb-12"
            style={{
              background: 'linear-gradient(135deg, #E8C4B8 0%, #D4A89F 50%, #B8C4E8 100%)',
              filter: 'blur(20px)',
              opacity: 0.6
            }}
          />
        </div>
        
        <h1 className="text-5xl lg:text-6xl mb-6 tracking-tight">
          Soul Talk
        </h1>
        
        <p className="text-[#6B6B6B] text-lg lg:text-xl max-w-2xl leading-relaxed mb-16">
          Connect through thoughts, not profiles.
        </p>

        <div className="w-full max-w-lg">
          <label className="text-base lg:text-lg text-[#6B6B6B] mb-4 block text-left">
            Enter your phone number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="(778) 899-0011"
            className="w-full px-6 py-5 bg-white rounded-2xl border border-[#E8E8E8] focus:outline-none focus:border-[#3D3D3D] transition-colors text-[#3D3D3D] placeholder:text-[#BEBEBE] text-center text-xl lg:text-2xl"
            maxLength={10}
            autoFocus
          />
          <p className="text-sm lg:text-base text-[#9B9B9B] mt-4 text-center">
            We&apos;ll send you a verification code
          </p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={phoneNumber.length < 10}
        className="w-full max-w-lg py-5 bg-[#3D3D3D] text-white rounded-full text-xl lg:text-2xl hover:bg-[#2D2D2D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        Continue
        <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
      </button>
    </div>
  );
}
