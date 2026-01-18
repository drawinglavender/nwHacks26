import { Heart } from 'lucide-react';

interface MatchConfirmationProps {
  onContinue: () => void;
}

export function MatchConfirmation({ onContinue }: MatchConfirmationProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F3EF81] to-[#81E8F3] flex items-center justify-center">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div>

        {/* Message */}
        <div className="space-y-4 max-w-sm">
          <h2 className="text-3xl tracking-tight text-[#3D3D3D]">
            It's a match
          </h2>
          <p className="text-lg text-[#5A5A5A] leading-relaxed">
            You both want to keep talking. Take all the time you need.
          </p>
        </div>

        {/* Info */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E6E6] max-w-sm">
          <p className="text-sm text-[#5A5A5A] leading-relaxed">
            You can now continue your conversation without time limits. Reveal more about yourselves when you're ready.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90"
      >
        Continue conversation
      </button>
    </div>
  );
}
