import React, { useState, useRef, useEffect } from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatScreenProps {
  userSoulColor: { from: string; to: string };
  otherSoulColor: { from: string; to: string };
  userAnswers: OnboardingAnswer[];
  otherUserAnswers: OnboardingAnswer[];
  onNavigate: (screen: Screen) => void;
}

interface Message {
  id: string;
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
  onNavigate
}: ChatScreenProps) {
  const initialMessages: Message[] = [
    {
      id: 'other-1001',
      text: "Hey, thanks for accepting. I really connected with your prompt.",
      sender: 'other',
      timestamp: new Date('2024-01-01T10:00:00'),
    },
    {
      id: 'user-1002',
      text: "Thanks! I've been thinking about this a lot lately.",
      sender: 'user',
      timestamp: new Date('2024-01-01T10:01:00'),
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // seconds
  const [revealedAnswers, setRevealedAnswers] = useState<RevealMoment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatEndModal, setShowChatEndModal] = useState(false);
  const [chatEndState, setChatEndState] = useState<'initial' | 'loading' | 'matched'>('initial');
  const [isMatched, setIsMatched] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, revealedAnswers, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowChatEndModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Every second
    return () => clearInterval(interval);
  }, []);

  const handleContinueChat = () => {
    setChatEndState('loading');
    // Simulate waiting for other user's response
    setTimeout(() => {
      const isMatch = Math.random() > 0.5; // 50% chance of match
      if (isMatch) {
        setChatEndState('matched');
        setIsMatched(true);
        // Auto-close after 3 seconds and remove timer
        setTimeout(() => {
          setShowChatEndModal(false);
        }, 3000);
      } else {
        // Rejected - go back to lounge
        onNavigate('lounge');
      }
    }, 2000 + Math.random() * 2000); // 2-4 seconds delay
  };

  const handleEndChat = () => {
    onNavigate('lounge');
  };

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

    const userMsgId = `user-${Date.now()}-${Math.random()}`;
    const newMsg: Message = {
      id: userMsgId,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate other user reply after a delay
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "That's interesting. Tell me more.",
        "I can relate to that.",
        "What made you think about that?",
        "That's a good point.",
        "I feel the same way.",
        "How did you come to that realization?",
      ];
      const replyId = `other-${Date.now()}-${Math.random()}`;
      const reply: Message = {
        id: replyId,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500 + Math.random() * 1500); // 1.5-3 seconds delay
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F9F9F8]">
      {/* Header */}
      <div className="px-4 lg:px-6 pt-12 lg:pt-12 pb-4 bg-white border-b border-[#E6E6E6] space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('lounge')}
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#F5F5F5] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 lg:w-7 lg:h-7 text-[#3D3D3D]" />
          </button>

          <div className="flex items-center gap-2 lg:gap-3">
            <div
              className="w-8 h-8 lg:w-12 lg:h-12 rounded-full relative"
              style={{
                background: `linear-gradient(135deg, ${otherSoulColor.from} 0%, ${otherSoulColor.to} 100%)`,
              }}
            >
              <div className="absolute inset-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/20 blur-md" />
            </div>
            <div
              className="w-8 h-8 lg:w-12 lg:h-12 rounded-full relative"
              style={{
                background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`,
              }}
            >
              <div className="absolute inset-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/20 blur-md" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[#898989] uppercase tracking-wide">Remaining Time</p>
            <p className="text-xl text-[#3D3D3D]">{!isMatched ? `${timeLeft}s` : '∞'}</p>
          </div>
        </div>

        {/* Progress Bar - hide when matched */}
        {!isMatched && (
          <div className="h-2 bg-[#F4F2E5] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F3EF81] to-[#81E8F3] transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="px-4 lg:px-6 py-4 text-center">
        <p className="text-sm text-[#8E8E8E]">
          You&apos;re both here now. Take your time.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
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
                  className={`max-w-[70%] lg:max-w-[75%] px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl ${
                    message.sender === 'user'
                      ? 'bg-[#3D3D3D] text-white rounded-br-lg'
                      : 'bg-white border border-[#E8E8E8] text-[#3D3D3D] rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm lg:text-base leading-relaxed">{message.text}</p>
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
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E8E8E8] px-4 lg:px-6 py-3 lg:py-4 rounded-2xl lg:rounded-3xl rounded-bl-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#9B9B9B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 lg:px-6 py-4 bg-white border-t border-[#E6E6E6]">
        <div className="flex items-center gap-3 bg-white rounded-full border border-[#C7C7C7] px-6 py-3 max-w-6xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Say hi to your potential soulmate"
            className="flex-1 bg-transparent text-[#3D3D3D] placeholder-[#C7C7C7] focus:outline-none text-sm lg:text-base"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-full bg-[#E6E6E6] flex items-center justify-center transition-colors hover:bg-[#C7C7C7] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-[#C7C7C7]" />
          </button>
        </div>
      </div>

      {/* Chat End Modal Overlay */}
      {showChatEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          {chatEndState === 'initial' && (
            <div className="bg-white/60 rounded-[40px] p-12 shadow-lg w-[450px] h-[440px] flex flex-col items-center gap-9">
              <div className="flex flex-col items-center gap-7">
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-[24px] font-medium text-center text-black">
                    This conversation is coming to a close.
                  </h2>
                  <p className="text-base italic text-center text-[#5A5A5A]">
                    You can keep going if it feels right.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={handleContinueChat}
                    className="w-full h-20 bg-[#F3EF81] rounded-[17px] flex items-center justify-center text-[20.8px] font-medium text-black hover:opacity-90 transition-opacity"
                  >
                    Continue chat
                  </button>
                  <button
                    onClick={handleEndChat}
                    className="w-full h-20 bg-[#E6E6E6] rounded-[17px] flex items-center justify-center text-[20.8px] font-medium text-black hover:opacity-90 transition-opacity"
                  >
                    End here
                  </button>
                </div>
              </div>
            </div>
          )}

          {chatEndState === 'loading' && (
            <div className="bg-white/60 rounded-[40px] p-12 shadow-lg w-[450px] h-[440px] flex flex-col items-center justify-center gap-9">
              <div className="flex flex-col items-center gap-[60px]">
                {/* Loading Animation */}
                <div className="relative w-[150px] h-[150px]">
                  <div className="absolute top-0 left-[58.64px] w-[32.73px] h-[31.36px] bg-[#F3EF81] rounded-full animate-pulse" />
                  <div className="absolute top-[58.64px] right-0 w-[32.73px] h-[31.36px] bg-[#D9D9D9] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-0 left-[58.64px] w-[32.73px] h-[31.36px] bg-[#D9D9D9] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-[58.64px] left-0 w-[32.73px] h-[31.36px] bg-[#C7C7C7] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                </div>
                
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-[27.7px] font-medium text-center text-black">
                    Waiting for them
                  </h2>
                  <p className="text-base italic text-center text-[#5A5A5A]">
                    You&apos;ve chosen to keep the conversation going. We&apos;ll let you know once they decide too.
                  </p>
                </div>
              </div>
            </div>
          )}

          {chatEndState === 'matched' && (
            <div className="bg-white/60 rounded-[40px] p-12 shadow-lg w-[450px] h-[440px] flex flex-col items-center justify-center gap-10">
              <div className="flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-[24px] font-bold text-center text-black">
                    You matched!
                  </h2>
                  <p className="text-base italic text-center text-black">
                    Looks like you both want to keep going.
                  </p>
                </div>
                
                {/* Soul Color Circles */}
                <div className="relative w-[293px] h-[192px]">
                  <div className="absolute inset-0 bg-white/22 backdrop-blur-sm rounded-lg" />
                  <div 
                    className="absolute left-[55.63px] top-[5.33px] w-[172.25px] h-[172.25px] rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`
                    }}
                  />
                  <div 
                    className="absolute right-[38.5px] top-[5.44px] w-[169.21px] h-[169.21px] rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${otherSoulColor.from} 0%, ${otherSoulColor.to} 100%)`
                    }}
                  />
                </div>
                
                <p className="text-sm italic text-center text-[#5A5A5A]">
                  Taking you back to the chat in 3 seconds.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
