import { useState, useEffect, useRef } from 'react';
import { UserData } from '../App';
import { Send } from 'lucide-react';

interface ChatroomProps {
  userData: UserData;
  onTimeEnd: () => void;
}

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "What's a small thing that makes a day feel lighter?",
    isOwn: false,
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '2',
    text: "When the sky turns that soft color right before sunset.",
    isOwn: true,
    timestamp: new Date(Date.now() - 120000),
  },
];

export function Chatroom({ userData, onTimeEnd }: ChatroomProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(876); // 14:36 in seconds
  const [showReveal, setShowReveal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherUserColor = '#81E8F3';
  const otherUserColorSecondary = '#F3EF81';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show progressive reveal after some messages
    if (messages.length >= 10) {
      setShowReveal(true);
    }

    return () => clearInterval(interval);
  }, [messages.length, onTimeEnd]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isOwn: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const progressPercentage = (timeRemaining / 876) * 100;

  return (
    <div className="h-screen bg-[#F9F9F8] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-[#E6E6E6] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Other User's Soul Color */}
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${otherUserColor} 0%, ${otherUserColorSecondary} 100%)`
                }}
              />
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-white/20 blur-md" />
            </div>

            {/* Your Soul Color */}
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${userData.soulColor} 0%, ${userData.soulColorSecondary} 100%)`
                }}
              />
              <div className="absolute inset-0 w-10 h-10 rounded-full bg-white/20 blur-md" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#898989] uppercase tracking-wide">Remaining Time</p>
            <p className="text-xl text-[#3D3D3D]">{formatTime(timeRemaining)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#F4F2E5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#F3EF81] to-[#81E8F3] transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Progressive Reveal Notification */}
      {showReveal && (
        <div className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-[#E6E6E6]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#5A5A5A]">
              You've unlocked a shared answer
            </p>
            <button className="text-xs text-[#3D3D3D] underline">
              View
            </button>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="px-6 py-4 text-center">
        <p className="text-sm text-[#8E8E8E]">
          You're both here now. Take your time.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-5 py-3.5 rounded-3xl ${
                message.isOwn
                  ? 'bg-[#F3EF81] text-[#3D3D3D]'
                  : 'bg-[#F4F2E5] text-[#3D3D3D]'
              }`}
            >
              <p className="text-base leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-[#E6E6E6]">
        <div className="flex items-center gap-3 bg-white rounded-full border border-[#C7C7C7] px-6 py-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Say hi to your potential soulmate"
            className="flex-1 bg-transparent text-[#3D3D3D] placeholder-[#C7C7C7] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-[#E6E6E6] flex items-center justify-center transition-colors hover:bg-[#C7C7C7] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-[#C7C7C7]" />
          </button>
        </div>
      </div>
    </div>
  );
}
