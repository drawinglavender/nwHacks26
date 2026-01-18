interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 bg-[#F9F9F8]">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        {/* Soul Color Visual */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F3EF81] to-[#81E8F3] opacity-90" />
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-white/20 blur-md" />
        </div>

        {/* App Name */}
        <h1 className="text-5xl tracking-tight text-[#3D3D3D]">Soul Talk</h1>

        {/* Value Statement */}
        <p className="text-lg text-[#5A5A5A] max-w-xs leading-relaxed">
          Connect through thoughts, not profiles.
        </p>
      </div>

      {/* CTAs */}
      <div className="w-full space-y-4">
        <button
          onClick={onNext}
          className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90"
        >
          Start
        </button>
        <button className="w-full text-[#898989] py-4 text-base">
          How it works
        </button>
      </div>
    </div>
  );
}
