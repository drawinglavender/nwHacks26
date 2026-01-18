import { UserData } from '../App';

interface SoulColorRevealProps {
  userData: UserData;
  onNext: () => void;
}

export function SoulColorReveal({ userData, onNext }: SoulColorRevealProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 bg-[#F9F9F8]">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        {/* Soul Color Visual */}
        <div className="relative">
          <div 
            className="w-48 h-48 rounded-full bg-gradient-to-br opacity-90"
            style={{
              backgroundImage: `linear-gradient(135deg, ${userData.soulColor} 0%, ${userData.soulColorSecondary} 100%)`
            }}
          />
          <div className="absolute inset-0 w-48 h-48 rounded-full bg-white/20 blur-xl" />
        </div>

        {/* Soul Color Name */}
        <div className="space-y-4">
          <p className="text-xs text-[#898989] uppercase tracking-wide">
            Your Soul Color
          </p>
          <h1 className="text-4xl tracking-tight text-[#3D3D3D]">
            {userData.soulColorName}
          </h1>
          <p className="text-lg text-[#5A5A5A] max-w-xs leading-relaxed">
            {userData.soulColorDescription}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90"
      >
        Start a conversation
      </button>
    </div>
  );
}
