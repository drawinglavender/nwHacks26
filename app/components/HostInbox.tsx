import React from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ArrowLeft, Check, X } from 'lucide-react';

interface HostInboxProps {
  userSoulColor: { from: string; to: string };
  onNavigate: (screen: Screen) => void;
  onAccept: (thought: any) => void;
}

const mockReplies = [
  {
    id: 1,
    senderSoulColor: { from: '#B8D4C4', to: '#9FBFAA' },
    message: "I relate to this so much. Would love to talk about it.",
    originalThought: "Does anyone else feel like they're more themselves online?",
    timeLeft: 8,
  },
  {
    id: 2,
    senderSoulColor: { from: '#C4B8E8', to: '#A89FD4' },
    message: "This resonates. I've been thinking about the same thing lately.",
    originalThought: "What's something small that made you smile today?",
    timeLeft: 5,
  },
];

export function HostInbox({ userSoulColor, onNavigate, onAccept }: HostInboxProps) {
  const handleAccept = (reply: any) => {
    onAccept(reply);
  };

  const handlePass = (replyId: number) => {
    // In a real app, this would remove the reply
    console.log('Passed on reply', replyId);
  };

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate('lounge')}
          className="w-10 h-10 rounded-full bg-white border border-[#E8E8E8] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#3D3D3D]" />
        </button>
        <h1 className="text-2xl">Replies</h1>
      </div>

      {/* Replies list */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {mockReplies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <p className="text-[#9B9B9B] text-lg mb-2">No replies yet</p>
            <p className="text-[#BEBEBE] text-sm">
              When someone responds to your thoughts, they'll appear here.
            </p>
          </div>
        ) : (
          mockReplies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E8E8]"
            >
              {/* Original thought context */}
              <div className="mb-4 pb-4 border-b border-[#F5F5F5]">
                <p className="text-xs text-[#9B9B9B] mb-2">Your thought</p>
                <p className="text-sm text-[#6B6B6B] italic">
                  "{reply.originalThought}"
                </p>
              </div>

              {/* Reply */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${reply.senderSoulColor.from} 0%, ${reply.senderSoulColor.to} 100%)`,
                  }}
                />
                <div className="flex-1">
                  <p className="text-[#3D3D3D] leading-relaxed">
                    {reply.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(reply)}
                  className="flex-1 py-3 bg-[#3D3D3D] text-white rounded-full flex items-center justify-center gap-2 hover:bg-[#2D2D2D] transition-all"
                >
                  <Check className="w-5 h-5" />
                  Accept
                </button>
                <button
                  onClick={() => handlePass(reply.id)}
                  className="flex-1 py-3 bg-white border border-[#E8E8E8] text-[#6B6B6B] rounded-full flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-all"
                >
                  <X className="w-5 h-5" />
                  Pass
                </button>
              </div>

              {/* Time indicator */}
              <p className="text-xs text-[#9B9B9B] text-center mt-3">
                {reply.timeLeft} min to respond
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
