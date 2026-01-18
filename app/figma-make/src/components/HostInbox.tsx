import { Check, X, ArrowLeft } from 'lucide-react';

interface HostInboxProps {
  soulColor: string;
  onAccept: () => void;
  onBack: () => void;
}

interface Reply {
  id: string;
  text: string;
  soulColor: string;
  soulColorSecondary: string;
  timeRemaining: number;
}

const MOCK_REPLIES: Reply[] = [
  {
    id: '1',
    text: "I'd love to explore this with you. I've been thinking about this too...",
    soulColor: '#E8B4F3',
    soulColorSecondary: '#B4D4F3',
    timeRemaining: 180,
  },
  {
    id: '2',
    text: "This really resonates. Can we talk about it?",
    soulColor: '#A3E4D7',
    soulColorSecondary: '#A3D4E4',
    timeRemaining: 240,
  },
  {
    id: '3',
    text: "I have a different perspective on this that might be interesting...",
    soulColor: '#FFD4A3',
    soulColorSecondary: '#FFE8A3',
    timeRemaining: 120,
  },
];

export function HostInbox({ soulColor, onAccept, onBack }: HostInboxProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] pb-6">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5A5A5A] hover:text-[#3D3D3D] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl tracking-tight text-[#3D3D3D]">Replies</h1>
        <p className="text-sm text-[#898989]">
          Someone wants to talk. Choose mindfully.
        </p>
      </div>

      {/* Replies List */}
      <div className="px-6 space-y-4">
        {MOCK_REPLIES.map((reply) => (
          <div
            key={reply.id}
            className="bg-white rounded-3xl p-6 space-y-4 border border-[#E6E6E6]"
          >
            <div className="flex items-start gap-4">
              {/* Soul Color */}
              <div className="relative shrink-0">
                <div 
                  className="w-14 h-14 rounded-full bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${reply.soulColor} 0%, ${reply.soulColorSecondary} 100%)`
                  }}
                />
                <div 
                  className="absolute inset-0 w-14 h-14 rounded-full bg-white/20 blur-md"
                />
              </div>

              {/* Reply Content */}
              <div className="flex-1 space-y-3">
                <p className="text-base text-[#3D3D3D] leading-relaxed">
                  {reply.text}
                </p>
                
                <p className="text-xs text-[#898989]">
                  Expires in {formatTime(reply.timeRemaining)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onAccept}
                className="flex-1 flex items-center justify-center gap-2 bg-[#3D3D3D] text-white py-3 rounded-full text-sm transition-opacity hover:opacity-90"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#898989] py-3 rounded-full text-sm border border-[#E6E6E6] hover:border-[#898989] transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Pass</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
