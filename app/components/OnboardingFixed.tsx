import React, { useState } from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { ChevronRight } from 'lucide-react';

interface OnboardingFixedProps {
  onNavigate: (screen: Screen) => void;
  onComplete: (answers: OnboardingAnswer[]) => void;
}

const fixedQuestions = [
  {
    question: "What brings you here today?",
    type: 'choice' as const,
    options: [
      "Looking for genuine conversations",
      "Want to share what's on my mind",
      "Seeking different perspectives",
      "Just curious to connect",
    ]
  },
  {
    question: "What kind of conversation feels good to you?",
    type: 'choice' as const,
    options: [
      "Deep and meaningful",
      "Light and curious",
      "Thoughtful and reflective",
      "Open and spontaneous",
    ]
  },
];

export function OnboardingFixed({ onNavigate, onComplete }: OnboardingFixedProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);

  const handleSelectOption = (option: string) => {
    const newAnswers = [
      ...answers,
      { question: fixedQuestions[currentQuestion].question, answer: option }
    ];
    setAnswers(newAnswers);
    
    if (currentQuestion < fixedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 pt-16">
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex gap-2 mb-2">
          {fixedQuestions.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${
                index <= currentQuestion ? 'bg-[#3D3D3D]' : 'bg-[#E8E8E8]'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#9B9B9B] text-right">
          Step {currentQuestion + 1} of 3
        </p>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl mb-8 leading-snug">
          {fixedQuestions[currentQuestion].question}
        </h2>

        <div className="space-y-3">
          {fixedQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectOption(option)}
              className="w-full p-5 bg-white rounded-2xl border border-[#E8E8E8] text-left hover:border-[#3D3D3D] transition-all text-[#3D3D3D]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
