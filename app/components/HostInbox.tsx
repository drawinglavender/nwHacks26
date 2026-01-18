import React from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ArrowLeft, Check, X } from 'lucide-react';

interface HostInboxProps {
  userSoulColor: { name: string; from: string; to: string };
  onNavigate: (screen: Screen) => void;
  onAccept: (thought: any) => void;
}

const mockReplies = [
  {
    id: 1,
    senderSoulColor: { name: 'Soft Sage', from: '#689F38', to: '#8BC34A' },
    message: "I relate to this so much. Would love to talk about it.",
    originalThought: "Does anyone else feel like they're more themselves online?",
    timeLeft: 180, // seconds
  },
  {
    id: 2,
    senderSoulColor: { name: 'Lavender Mist', from: '#7B1FA2', to: '#BA68C8' },
    message: "This resonates. I've been thinking about the same thing lately.",
    originalThought: "What's something small that made you smile today?",
    timeLeft: 120, // seconds
  },
];

export function HostInbox({ userSoulColor, onNavigate, onAccept }: HostInboxProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = (reply: any) => {
    onAccept(reply);
  };

  const handlePass = (replyId: number) => {
    // In a real app, this would remove the reply
    console.log('Passed on reply', replyId);
  };

  return (
    <div className="h-full flex flex-col bg-[#F9F9F8]">
      {/* Header */}
      <div className="px-4 lg:px-6 pt-12 lg:pt-12 pb-6 space-y-4">
        <button
          onClick={() => onNavigate('lounge')}
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

      {/* Replies list */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 space-y-4">
        {mockReplies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <p className="text-[#9B9B9B] text-lg mb-2">No replies yet</p>
            <p className="text-[#BEBEBE] text-sm">
              When someone responds to your thoughts, they&apos;ll appear here.
            </p>
          </div>
        ) : (
          mockReplies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white rounded-3xl p-6 space-y-4 border border-[#E6E6E6]"
            >
              <div className="flex items-start gap-4">
                {/* Soul Color */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${reply.senderSoulColor.to} 0%, ${reply.senderSoulColor.from} 70%, transparent 90%)`,
                        filter: 'blur(1.5px)'
                      }}
                    />
                    <div 
                      className="absolute inset-1 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 65% 65%, ${reply.senderSoulColor.from} 0%, ${reply.senderSoulColor.to} 60%, transparent 85%)`,
                        filter: 'blur(1px)'
                      }}
                    />
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${reply.senderSoulColor.to} 0%, ${reply.senderSoulColor.from} 100%)`,
                        filter: 'blur(0.5px)'
                      }}
                    />
                  </div>
                </div>

                {/* Reply Content */}
                <div className="flex-1 space-y-3">
                  <p className="text-base text-[#3D3D3D] leading-relaxed">
                    {reply.message}
                  </p>
                  
                  <p className="text-xs text-[#898989]">
                    Expires in {formatTime(reply.timeLeft)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(reply)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#3D3D3D] text-white py-3 rounded-full text-sm transition-opacity hover:opacity-90"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handlePass(reply.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-[#898989] py-3 rounded-full text-sm border border-[#E6E6E6] hover:border-[#898989] transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Pass</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
