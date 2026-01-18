import { useState } from 'react';

interface OnboardingFixedProps {
  onNext: (answers: Record<string, string>) => void;
}

const FIXED_QUESTIONS = [
  {
    id: 'intent',
    question: 'What brings you here today?',
    options: [
      'Looking for genuine conversation',
      'Wanting to share what\'s on my mind',
      'Curious to hear different perspectives',
      'Feeling a bit lonely',
    ],
  },
  {
    id: 'mood',
    question: 'How would you describe your energy right now?',
    options: [
      'Calm and reflective',
      'Curious and open',
      'Thoughtful and quiet',
      'Present and ready',
    ],
  },
];

export function OnboardingFixed({ onNext }: OnboardingFixedProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = FIXED_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / FIXED_QUESTIONS.length) * 100;

  const handleSelect = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < FIXED_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        onNext(newAnswers);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-[#F9F9F8]">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-1 bg-[#E6E6E6] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#3D3D3D] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#898989] mt-2">
          Step {currentQuestion + 1} of {FIXED_QUESTIONS.length}
        </p>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <h2 className="text-2xl tracking-tight text-[#3D3D3D] leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-6 py-4 bg-white rounded-3xl text-left text-[#3D3D3D] border border-[#E6E6E6] hover:border-[#898989] transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
