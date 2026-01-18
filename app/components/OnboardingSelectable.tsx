import React, { useState } from 'react';
import { Screen, OnboardingAnswer } from '../page';
import { Shuffle, ChevronRight } from 'lucide-react';

interface OnboardingSelectableProps {
  existingAnswers: OnboardingAnswer[];
  onNavigate: (screen: Screen) => void;
  onComplete: (allAnswers: OnboardingAnswer[]) => void;
}

const allQuestions = [
  "What makes you feel alive?",
  "When do you feel most understood?",
  "What's a question you love being asked?",
  "What kind of person brings out the best in you?",
  "What do you value most in connection?",
  "What's something you're learning right now?",
  "What makes a conversation memorable for you?",
  "When do you feel most like yourself?",
  "What do you think about when you're alone?",
  "What kind of energy do you appreciate in others?",
  "What would you want someone to know about you?",
  "What makes you curious about someone?",
];

export function OnboardingSelectable({ existingAnswers, onNavigate, onComplete }: OnboardingSelectableProps) {
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>(
    shuffleArray([...allQuestions]).slice(0, 6)
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [currentAnswering, setCurrentAnswering] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const handleShuffle = () => {
    setDisplayedQuestions(shuffleArray([...allQuestions]).slice(0, 6));
    setSelectedQuestions([]);
  };

  const handleSelectQuestion = (question: string) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter(q => q !== question));
    } else if (selectedQuestions.length < 2) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const handleStartAnswering = () => {
    if (selectedQuestions.length === 2) {
      setCurrentAnswering(selectedQuestions[0]);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim() || !currentAnswering) return;

    const newAnswers = [...answers, { question: currentAnswering, answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    const nextQuestionIndex = selectedQuestions.indexOf(currentAnswering) + 1;
    if (nextQuestionIndex < selectedQuestions.length) {
      setCurrentAnswering(selectedQuestions[nextQuestionIndex]);
    } else {
      // All done
      onComplete([...existingAnswers, ...newAnswers]);
    }
  };

  // If currently answering a question
  if (currentAnswering) {
    const currentIndex = selectedQuestions.indexOf(currentAnswering);
    return (
      <div className="h-full flex flex-col p-8 pt-16">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex gap-2 mb-2">
            {selectedQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentIndex ? 'bg-[#3D3D3D]' : 'bg-[#E8E8E8]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#9B9B9B] text-right">
            Step 3 of 3 · Question {currentIndex + 1} of 2
          </p>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl mb-8 leading-snug">
            {currentAnswering}
          </h2>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Take your time..."
            className="w-full h-48 p-4 bg-white rounded-2xl border border-[#E8E8E8] resize-none focus:outline-none focus:border-[#3D3D3D] transition-colors text-[#3D3D3D] placeholder:text-[#BEBEBE]"
            autoFocus
            maxLength={300}
          />
        </div>

        <button
          onClick={handleSubmitAnswer}
          disabled={!currentAnswer.trim()}
          className="w-full py-4 bg-[#3D3D3D] text-white rounded-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Question selection screen
  return (
    <div className="h-full flex flex-col p-8 pt-16">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex gap-2 mb-2">
          <div className="h-1 flex-1 rounded-full bg-[#3D3D3D]" />
          <div className="h-1 flex-1 rounded-full bg-[#3D3D3D]" />
          <div className="h-1 flex-1 rounded-full bg-[#E8E8E8]" />
        </div>
        <p className="text-xs text-[#9B9B9B] text-right">
          Step 3 of 3
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-3 leading-snug">
          Choose 2 questions to answer
        </h2>
        <p className="text-[#6B6B6B] text-sm">
          Pick the ones that resonate with you
        </p>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto -mx-2">
        <div className="grid grid-cols-2 gap-3 px-2">
          {displayedQuestions.map((question, index) => {
            const isSelected = selectedQuestions.includes(question);
            const selectionOrder = selectedQuestions.indexOf(question);
            
            return (
              <button
                key={index}
                onClick={() => handleSelectQuestion(question)}
                disabled={!isSelected && selectedQuestions.length >= 2}
                className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[120px] flex items-center justify-center relative ${
                  isSelected
                    ? 'border-[#3D3D3D] bg-white'
                    : 'border-[#E8E8E8] bg-white disabled:opacity-40'
                }`}
              >
                <p className="text-sm text-[#3D3D3D] leading-snug">
                  {question}
                </p>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#3D3D3D] text-white flex items-center justify-center text-xs">
                    {selectionOrder + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-6">
        <button
          onClick={handleShuffle}
          className="w-full py-3 bg-white border border-[#E8E8E8] text-[#6B6B6B] rounded-full flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-all"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle Questions
        </button>

        <button
          onClick={handleStartAnswering}
          disabled={selectedQuestions.length !== 2}
          className="w-full py-4 bg-[#3D3D3D] text-white rounded-full flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2D2D2D] transition-all"
        >
          Answer Selected
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
