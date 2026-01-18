import { useState } from 'react';

interface CreatePromptProps {
  soulColor: string;
  soulColorSecondary: string;
  onNext: (prompt: string) => void;
}

export function CreatePrompt({ soulColor, soulColorSecondary, onNext }: CreatePromptProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onNext(prompt);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-12 bg-[#F9F9F8]">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-3 text-center">
          {/* Soul Color Visual */}
          <div className="relative mx-auto w-20 h-20">
            <div 
              className="w-20 h-20 rounded-full bg-gradient-to-br opacity-90"
              style={{
                backgroundImage: `linear-gradient(135deg, ${soulColor} 0%, ${soulColorSecondary} 100%)`
              }}
            />
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/20 blur-lg" />
          </div>

          <h2 className="text-3xl tracking-tight text-[#3D3D3D]">
            Share a thought
          </h2>
          <p className="text-base text-[#898989] leading-relaxed max-w-xs mx-auto">
            Say what's on your mind. Someone out there wants to listen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What's on your mind right now?"
            rows={6}
            maxLength={200}
            className="w-full px-6 py-4 bg-white rounded-3xl text-[#3D3D3D] placeholder-[#C7C7C7] border border-[#E6E6E6] focus:outline-none focus:border-[#898989] transition-colors resize-none"
          />
          <p className="text-xs text-[#898989] text-right">
            {prompt.length}/200
          </p>
        </form>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!prompt.trim()}
        className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Post thought
      </button>
    </div>
  );
}
