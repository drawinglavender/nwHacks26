interface ChatFeedbackProps {
  onContinue: (wantsToContinue: boolean) => void;
}

export function ChatFeedback({ onContinue }: ChatFeedbackProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-sm">
        <div className="space-y-4">
          <h2 className="text-3xl tracking-tight text-[#3D3D3D]">
            Time's up
          </h2>
          <p className="text-lg text-[#5A5A5A] leading-relaxed">
            How did this conversation feel?
          </p>
        </div>

        <div className="w-full space-y-3">
          {[
            'Meaningful',
            'Comfortable',
            'Interesting',
            'A bit awkward',
            'Not quite right',
          ].map((feeling) => (
            <button
              key={feeling}
              className="w-full px-6 py-4 bg-white rounded-3xl text-[#3D3D3D] border border-[#E6E6E6] hover:border-[#898989] transition-all"
            >
              {feeling}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => onContinue(true)}
          className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90"
        >
          I'd like to keep talking
        </button>
        <button
          onClick={() => onContinue(false)}
          className="w-full text-[#898989] py-4 text-base"
        >
          End conversation
        </button>
      </div>
    </div>
  );
}
