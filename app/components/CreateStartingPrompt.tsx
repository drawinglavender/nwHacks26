import React, { useState } from 'react';
import { Screen } from '../page';
import { ChevronRight } from 'lucide-react';

interface CreateStartingPromptProps {
  userSoulColor: { from: string; to: string };
  onNavigate: (screen: Screen) => void;
}

export function CreateStartingPrompt({ userSoulColor, onNavigate }: CreateStartingPromptProps) {
  const [prompt, setPrompt] = useState('');

  const handlePost = () => {
    if (prompt.trim()) {
      onNavigate('lounge');
    }
  };

  return (
    <div className="h-full flex flex-col p-8 pt-16">
      <div className="mb-8">
        <h2 className="text-2xl mb-3 leading-snug">
          Start a conversation
        </h2>
        <p className="text-[#6B6B6B] text-sm leading-relaxed">
          Share a thought, ask a question, or say what's on your mind. Keep it simple and honest.
        </p>
      </div>

      <div className="flex-1">
        {/* Soul color preview */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`,
            }}
          />
          <p className="text-sm text-[#6B6B6B]">This is how others will see you</p>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What's on your mind right now?"
          className="w-full h-56 p-4 bg-white rounded-2xl border border-[#E8E8E8] resize-none focus:outline-none focus:border-[#3D3D3D] transition-colors text-[#3D3D3D] placeholder:text-[#BEBEBE]"
          autoFocus
          maxLength={200}
        />
        <p className="text-xs text-[#9B9B9B] text-right mt-2">
          {prompt.length}/200
        </p>
      </div>

      <button
        onClick={handlePost}
        disabled={!prompt.trim()}
        className="w-full py-4 bg-[#3D3D3D] text-white rounded-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all"
      >
        Post Prompt
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
