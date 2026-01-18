import React, { useState, useRef, useEffect } from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatScreenProps {
  userSoulColor: { from: string; to: string };
  otherSoulColor: { from: string; to: string };
  userAnswers: OnboardingAnswer[];
  otherUserAnswers: OnboardingAnswer[];
  onNavigate: (screen: Screen) => void;
  onTimeEnd: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

interface RevealMoment {
  messageCount: number;
  answer: OnboardingAnswer;
  sender: 'user' | 'other';
}

export function ChatScreen({ 
  userSoulColor, 
  otherSoulColor, 
  userAnswers,
  otherUserAnswers,
  onNavigate, 
  onTimeEnd 
}: ChatScreenProps) {
  const initialMessages: Message[] = [
    {
      id: 1001,
      text: "Hey, thanks for accepting. I really connected with your prompt.",
      sender: 'other',
      timestamp: new Date('2024-01-01T10:00:00'),
    },
    {
      id: 1002,
      text: "Thanks! I've been thinking about this a lot lately.",
      sender: 'user',
      timestamp: new Date('2024-01-01T10:01:00'),
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // minutes
  const [revealedAnswers, setRevealedAnswers] = useState<RevealMoment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, revealedAnswers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => onTimeEnd(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Every minute
    return () => clearInterval(interval);
  }, [onTimeEnd]);

  // Progressive reveal logic
  useEffect(() => {
    const messageCount = messages.length;
    
    // Reveal at specific message counts
    const revealThresholds = [10, 20, 30, 40];
    
    revealThresholds.forEach((threshold, index) => {
      if (messageCount === threshold) {
        // Alternate between revealing other user's and user's answers
        const isOtherUser = index % 2 === 0;
        const answerPool = isOtherUser ? otherUserAnswers : userAnswers;
        const alreadyRevealed = revealedAnswers.filter(r => r.sender === (isOtherUser ? 'other' : 'user')).length;
        
        if (alreadyRevealed < answerPool.length) {
          const newReveal: RevealMoment = {
            messageCount: threshold,
            answer: answerPool[alreadyRevealed],
            sender: isOtherUser ? 'other' : 'user'
          };
          setRevealedAnswers(prev => [...prev, newReveal]);
        }
      }
    });
  }, [messages.length, otherUserAnswers, userAnswers, revealedAnswers]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate other user reply after a delay
    setTimeout(() => {
      const replies = [
        "That's interesting. Tell me more.",
        "I can relate to that.",
        "What made you think about that?",
        "That's a good point.",
      ];
      const reply: Message = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('lounge')}
            className="w-14 h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center"
          >
            <ArrowLeft className="w-7 h-7 text-[#3D3D3D]" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`,
              }}
            />
            <div
              className="w-12 h-12 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${otherSoulColor.from} 0%, ${otherSoulColor.to} 100%)`,
              }}
            />
          </div>

          <div className="w-14" /> {/* Spacer */}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 flex-1 bg-[#F5F5F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3D3D3D] rounded-full transition-all"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#9B9B9B] whitespace-nowrap">
            {timeLeft} min
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => {
          // Check if there's a reveal moment after this message
          const revealAfter = revealedAnswers.find(r => {
            const messagesUpToThis = messages.slice(0, index + 1).length;
            return r.messageCount === messagesUpToThis;
          });

          return (
            <React.Fragment key={message.id}>
              <div
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-6 py-4 rounded-3xl ${
                    message.sender === 'user'
                      ? 'bg-[#3D3D3D] text-white rounded-br-lg'
                      : 'bg-white border border-[#E8E8E8] text-[#3D3D3D] rounded-bl-lg'
                  }`}
                >
                  <p className="text-base leading-relaxed">{message.text}</p>
                </div>
              </div>

              {/* Progressive reveal card */}
              {revealAfter && (
                <div className="flex justify-center py-2">
                  <div className="max-w-[85%] bg-[#F5F5F5] rounded-2xl p-5 border border-[#E8E8E8]">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${
                            revealAfter.sender === 'user' 
                              ? `${userSoulColor.from} 0%, ${userSoulColor.to}` 
                              : `${otherSoulColor.from} 0%, ${otherSoulColor.to}`
                          } 100%)`,
                        }}
                      />
                      <p className="text-xs text-[#9B9B9B]">
                        {revealAfter.sender === 'user' ? 'You' : 'They'} shared more
                      </p>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mb-2 italic">
                      {revealAfter.answer.question}
                    </p>
                    <p className="text-sm text-[#3D3D3D]">
                      {revealAfter.answer.answer}
                    </p>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-[#E8E8E8]">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Talk in the moment..."
            className="flex-1 px-6 py-4 bg-[#F5F5F5] rounded-full focus:outline-none text-[#3D3D3D] placeholder:text-[#BEBEBE] text-base"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-14 h-14 bg-[#3D3D3D] text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all"
          >
            <Send className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
