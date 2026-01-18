import { useState, useEffect } from 'react';
import { UserData } from '../App';
import { Clock, MessageCircle } from 'lucide-react';

interface LiveLoungeProps {
  userData: UserData;
  onOpenInbox: () => void;
  onJoinChat: () => void;
}

interface Thought {
  id: string;
  text: string;
  soulColor: string;
  soulColorSecondary: string;
  timeRemaining: number;
  mood: 'Light' | 'Deep' | 'Curious';
}

const MOCK_THOUGHTS: Thought[] = [
  {
    id: '1',
    text: "What's something you believed as a child that still shapes how you see the world?",
    soulColor: '#E8B4F3',
    soulColorSecondary: '#B4D4F3',
    timeRemaining: 847,
    mood: 'Deep',
  },
  {
    id: '2',
    text: "Just watched the sunrise. When was the last time you did something just because it felt right?",
    soulColor: '#FFD4A3',
    soulColorSecondary: '#FFE8A3',
    timeRemaining: 1205,
    mood: 'Light',
  },
  {
    id: '3',
    text: "Why do we feel lonelier when we're surrounded by people than when we're actually alone?",
    soulColor: '#A3E4D7',
    soulColorSecondary: '#A3D4E4',
    timeRemaining: 456,
    mood: 'Curious',
  },
  {
    id: '4',
    text: "What's a small thing that makes a day feel lighter?",
    soulColor: '#F3EF81',
    soulColorSecondary: '#81E8F3',
    timeRemaining: 623,
    mood: 'Light',
  },
];

export function LiveLounge({ userData, onOpenInbox, onJoinChat }: LiveLoungeProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>(MOCK_THOUGHTS);
  const [inboxCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughts(prev => 
        prev.map(t => ({
          ...t,
          timeRemaining: Math.max(0, t.timeRemaining - 1)
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredThoughts = selectedMood
    ? thoughts.filter(t => t.mood === selectedMood)
    : thoughts;

  return (
    <div className="min-h-screen bg-[#F9F9F8] pb-6">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl tracking-tight text-[#3D3D3D]">Live Lounge</h1>
          <button
            onClick={onOpenInbox}
            className="relative p-3 bg-white rounded-full border border-[#E6E6E6]"
          >
            <MessageCircle className="w-5 h-5 text-[#5A5A5A]" />
            {inboxCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#3D3D3D] text-white text-xs rounded-full flex items-center justify-center">
                {inboxCount}
              </div>
            )}
          </button>
        </div>

        <p className="text-sm text-[#898989]">
          Talk in the moment.
        </p>

        {/* Mood Filters */}
        <div className="flex gap-2">
          {['Light', 'Deep', 'Curious'].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedMood === mood
                  ? 'bg-[#3D3D3D] text-white'
                  : 'bg-white text-[#5A5A5A] border border-[#E6E6E6]'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Thoughts Feed */}
      <div className="px-6 space-y-4">
        {filteredThoughts.map((thought) => (
          <div
            key={thought.id}
            onClick={onJoinChat}
            className="bg-white rounded-3xl p-6 space-y-4 border border-[#E6E6E6] hover:border-[#898989] transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Soul Color */}
              <div className="relative shrink-0">
                <div 
                  className="w-14 h-14 rounded-full bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${thought.soulColor} 0%, ${thought.soulColorSecondary} 100%)`
                  }}
                />
                <div 
                  className="absolute inset-0 w-14 h-14 rounded-full bg-white/20 blur-md"
                />
              </div>

              {/* Thought Content */}
              <div className="flex-1 space-y-3">
                <p className="text-base text-[#3D3D3D] leading-relaxed">
                  {thought.text}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#898989] uppercase tracking-wide">
                    {thought.mood}
                  </span>
                  <div className="flex items-center gap-1.5 text-[#898989]">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatTime(thought.timeRemaining)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
