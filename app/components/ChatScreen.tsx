import React, { useState, useRef, useEffect } from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ArrowLeft, Send } from 'lucide-react';

// Custom zoom animation styles
const zoomAnimation = `
  @keyframes zoom-pulse {
    0%, 100% {
      transform: scale(1);
      font-weight: 500;
    }
    50% {
      transform: scale(1.05);
      font-weight: 600;
    }
  }
  .animate-zoom-pulse {
    animation: zoom-pulse 1.5s ease-in-out infinite;
  }

  @keyframes rotate-dots {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .animate-rotate {
    animation: rotate-dots 2s linear infinite;
  }

  @keyframes pulse-fast {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(0.95);
    }
  }
  .animate-pulse-fast {
    animation: pulse-fast 0.8s ease-in-out infinite;
  }
`;

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
  const [activePopupReveal, setActivePopupReveal] = useState<RevealMoment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalTime = 30; // total conversation time in seconds
  const reminderThreshold = totalTime * 0.15; // 15% of total time (4.5 seconds)

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
        
        // Save chat history to localStorage when matched
        const chatHistory = {
          messages: messages,
          revealedAnswers: revealedAnswers,
          userSoulColor,
          otherSoulColor,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        
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

  useEffect(() => {
    const messageCount = messages.length;
    
    // Reveal logic for both timed and matched conversations
    if (isMatched) {
      // After match, reveal every n messages
      const revealInterval = 6;
      const messagesSinceLastReveal = messageCount - (revealedAnswers[revealedAnswers.length - 1]?.messageCount || 0);
      
      // Continue until all responses from both users have been shared
      const totalUserAnswers = userAnswers.length;
      const totalOtherAnswers = otherUserAnswers.length;
      const totalAnswers = totalUserAnswers + totalOtherAnswers;
      
      if (messagesSinceLastReveal >= revealInterval && revealedAnswers.length < totalAnswers) {
        const nextSender = revealedAnswers.length % 2 === 0 ? 'user' : 'other';
        const answerPool = nextSender === 'user' ? userAnswers : otherUserAnswers;
        const alreadyRevealed = revealedAnswers.filter(r => r.sender === nextSender).length;
        
        if (alreadyRevealed < answerPool.length) {
          const newReveal: RevealMoment = {
            messageCount: messageCount,
            answer: answerPool[alreadyRevealed],
            sender: nextSender
          };
          setTimeout(() => {
            setRevealedAnswers(prev => [...prev, newReveal]);
            setActivePopupReveal(newReveal);
          }, 0);
        }
      }
    } else {
      // During timed conversation, reveal at specific message counts (more frequent)
      const revealThresholds = [5, 5, 5, 5, 5, 5];
      
      revealThresholds.forEach((threshold, index) => {
        if (messageCount === threshold) {
          // Alternate between revealing other user's and user's answers
          const isOtherUser = index % 2 === 0;
          const answerPool = isOtherUser ? otherUserAnswers : userAnswers;
          const alreadyRevealed = revealedAnswers.filter(r => r.sender === (isOtherUser ? 'other' : 'user')).length;
          
          // Continue until all responses from both users have been shared
          const totalUserAnswers = userAnswers.length;
          const totalOtherAnswers = otherUserAnswers.length;
          const totalAnswers = totalUserAnswers + totalOtherAnswers;
          
          if (alreadyRevealed < answerPool.length && revealedAnswers.length < totalAnswers) {
            const newReveal: RevealMoment = {
              messageCount: threshold,
              answer: answerPool[alreadyRevealed],
              sender: isOtherUser ? 'other' : 'user'
            };
            setRevealedAnswers(prev => [...prev, newReveal]);
            // Show popup for new reveal
            setActivePopupReveal(newReveal);
          }
        }
      });
    }
  }, [messages.length, otherUserAnswers, userAnswers, revealedAnswers, isMatched]);

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
      <style>{zoomAnimation}</style>
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

          <div className={`text-right transition-all duration-300 ${
            isMatched ? 'opacity-0 pointer-events-none' : ''
          }`}>
            <p className={`text-xs uppercase tracking-wide transition-colors duration-300 ${
              isMatched ? 'text-white' : 'text-black'
            }`}>
              Remaining Time:
            </p>
            <div className="flex items-center gap-2">
              <div 
                className={`w-5 h-5 rounded-full transition-all duration-1000 ${
                  timeLeft > 20 ? 'bg-green-500' : 
                  timeLeft > 10 ? 'bg-orange-500' : 
                  'bg-red-500'
                } ${
                  timeLeft <= reminderThreshold && !showChatEndModal ? 'animate-pulse-fast' : ''
                } ${
                  isMatched ? 'bg-white' : ''
                }`}
              />
              <p className={`text-2xl lg:text-3xl font-normal transition-colors duration-300 ${
                isMatched ? 'text-white' : 'text-black'
              }`}>
                {`00:${timeLeft.toString().padStart(2, '0')}`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar - static and full when matched */}
        <div className={`h-2 rounded-full overflow-hidden transition-all duration-300 ${
          isMatched ? 'bg-[#F4F2E5]' : 'bg-[#F4F2E5]'
        }`}>
          <div
              className={`h-full transition-width duration-1000 ease-linear ${
                isMatched ? 'bg-gradient-to-r from-[#F3EF81] to-[#81E8F3]' : 'bg-gradient-to-r from-[#F3EF81] to-[#81E8F3]'
              }`}
              style={{ 
                width: isMatched ? '100%' : `${(timeLeft / 30) * 100}%`,
                transition: 'width 1s linear'
              }}
            />
        </div>
      </div>

      {/* Helper Text */}
      <div className="px-4 lg:px-6 py-4 text-center">
        <p className={`text-sm text-[#8E8E8E] ${
          timeLeft <= reminderThreshold && timeLeft > 0 
            ? 'animate-zoom-pulse text-base' 
            : ''
        }`}>
          {timeLeft <= reminderThreshold && timeLeft > 0 
            ? `This conversation is ending in ${timeLeft} seconds. If it matters, say it.` 
            : "You're both here now. Take your time."
          }
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-4 lg:space-y-6">
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

              {/* Inline reveal component */}
              {revealAfter && (
                <div className="flex justify-center py-2">
                  <button
                    onClick={() => setActivePopupReveal(revealAfter)}
                    className="group flex flex-row items-center justify-between px-5 py-3.5 gap-3.5 bg-white border border-[#E9E9E9] rounded-[25px] hover:shadow-md transition-all duration-200 max-w-[85%]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px] text-[#5A5A5A]">🔓</span>
                      <span className="text-[14px] text-[#5A5A5A]">
                        You&apos;ve unlocked something meaningful. This detail can be revisited anytime.
                      </span>
                    </div>
                    <div className="w-3 h-2 bg-[#ADA703] rotate-90" />
                  </button>
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
        <div className="flex items-center gap-3 bg-white rounded-full border border-[#C7C7C7] px-8 py-4 max-w-6xl mx-auto group">
          {/* User Soul Color Circle - inside input bar on left */}
          <div className="relative w-8 h-8 lg:w-12 lg:h-12 rounded-full">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`,
              }}
            />
            <div className="absolute inset-0 w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-white/20 backdrop-blur-md" />
          </div>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Say hi to your potential soulmate"
            className="flex-1 bg-transparent text-[#3D3D3D] placeholder-[#C7C7C7] focus:outline-none text-sm lg:text-base ml-3"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-full bg-[#E6E6E6] flex items-center justify-center transition-all hover:bg-[#3D3D3D] hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 group-hover:bg-[#3D3D3D]"
          >
            <Send className="w-5 h-5 text-[#C7C7C7] transition-colors group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Chat End Modal Overlay */}
      {showChatEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="transition-all duration-300 ease-in-out">
            {chatEndState === 'initial' && (
              <div className="bg-white/90 rounded-[40px] p-12 shadow-2xl w-[450px] h-[440px] flex flex-col items-center gap-9 transition-all duration-300 ease-in-out">
                <div className="flex flex-col items-center gap-9">
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
                      className="w-full h-20 bg-[#F3EF81] rounded-[17px] flex items-center justify-center text-[20.8px] font-medium text-black hover:bg-[#E5D870] hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Continue chat
                    </button>
                    <button
                      onClick={handleEndChat}
                      className="w-full h-20 bg-[#E6E6E6] rounded-[17px] flex items-center justify-center text-[20.8px] font-medium text-black hover:bg-[#D8D8D8] hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      End here
                    </button>
                  </div>
                </div>
              </div>
            )}

            {chatEndState === 'loading' && (
              <div className="bg-white/90 rounded-[40px] p-12 shadow-2xl w-[450px] h-[440px] flex flex-col items-center justify-center gap-9 transition-all duration-300 ease-in-out">
                <div className="flex flex-col items-center gap-[60px]">
                  {/* Loading Animation */}
                  <div className="relative w-[150px] h-[150px] animate-rotate">
                    <div className="absolute top-0 left-[58.64px] w-[32.73px] h-[31.36px] bg-[#F3EF81] rounded-full" />
                    <div className="absolute top-[20px] right-[20px] w-[28px] h-[28px] bg-[#E8E8E8] rounded-full" />
                    <div className="absolute top-[58.64px] right-0 w-[32.73px] h-[31.36px] bg-[#D9D9D9] rounded-full" />
                    <div className="absolute bottom-[20px] right-[20px] w-[24px] h-[24px] bg-[#C7C7C7] rounded-full" />
                    <div className="absolute bottom-0 left-[58.64px] w-[32.73px] h-[31.36px] bg-[#B8B8B8] rounded-full" />
                    <div className="absolute bottom-[20px] left-[20px] w-[26px] h-[26px] bg-[#A8A8A8] rounded-full" />
                    <div className="absolute top-[58.64px] left-0 w-[32.73px] h-[31.36px] bg-[#989898] rounded-full" />
                    <div className="absolute top-[20px] left-[20px] w-[30px] h-[30px] bg-[#888888] rounded-full" />
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
              <div className="bg-white/90 rounded-[40px] p-12 shadow-2xl w-[450px] h-[440px] flex flex-col items-center justify-center gap-10 transition-all duration-300 ease-in-out">
                <div className="flex flex-col items-center gap-10">
                  <div className="flex flex-col items-center gap-6">
                    <h2 className="text-[24px] font-bold text-center text-black">
                      You matched!
                    </h2>
                    <p className="text-base italic text-center text-black">
                      Looks like you both want to keep going.
                    </p>
                  </div>
                  
                  {/* Soul Color Circles - spaced further apart */}
                  <div className="relative w-[350px] h-[192px]">
                    <div className="absolute inset-0 bg-white/22 backdrop-blur-sm rounded-lg" />
                    <div 
                      className="absolute left-[50px] top-[5.33px] w-[172.25px] h-[172.25px] rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${userSoulColor.from} 0%, ${userSoulColor.to} 100%)`
                      }}
                    />
                    <div 
                      className="absolute right-[50px] top-[5.44px] w-[169.21px] h-[169.21px] rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${otherSoulColor.from} 0%, ${otherSoulColor.to} 100%)`
                      }}
                    />
                  </div>
                  
                  <p className="text-sm italic text-center text-[#5A5A5A]">
                    Taking you back to the chat in a few seconds.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    {/* Reveal Popup Modal */}
      {activePopupReveal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setActivePopupReveal(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 border border-[#E8E8E8] max-w-[85%] mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${
                    activePopupReveal.sender === 'user' 
                      ? `${userSoulColor.from} 0%, ${userSoulColor.to}` 
                      : `${otherSoulColor.from} 0%, ${otherSoulColor.to}`
                  } 100%)`,
                }}
              />
              <p className="text-xs text-[#9B9B9B]">
                {activePopupReveal.sender === 'user' ? 'You' : 'They'} shared more
              </p>
            </div>
            <p className="text-xs text-[#6B6B6B] mb-2 italic">
              {activePopupReveal.answer.question}
            </p>
            <p className="text-sm text-[#3D3D3D]">
              {activePopupReveal.answer.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}