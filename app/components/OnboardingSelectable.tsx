import React, { useState } from 'react';
import { OnboardingAnswer, Screen } from '../page';
import { ChevronRight } from 'lucide-react';

interface OnboardingSelectableProps {
  existingAnswers: OnboardingAnswer[];
  onNavigate?: (screen: Screen) => void;
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

export function OnboardingSelectable({ existingAnswers, onComplete }: OnboardingSelectableProps) {
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>(() => {
    const questions = [...allQuestions];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions.slice(0, 6);
  });
  const [currentAnswering, setCurrentAnswering] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<OnboardingAnswer[]>([]);

  const handleSelectQuestion = (question: string) => {
    // Don't allow selecting questions that have already been answered
    if (answers.some(a => a.question === question)) {
      return;
    }
    
    // Redirect immediately to answer screen
    setCurrentAnswering(question);
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim() || !currentAnswering) return;

    const newAnswers = [...answers, { question: currentAnswering, answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    // If we have 2 answers, we're done
    if (newAnswers.length >= 2) {
      onComplete([...existingAnswers, ...newAnswers]);
    } else {
      // Replace answered question with a new one in displayedQuestions
      const unansweredQuestions = allQuestions.filter(q => 
        !newAnswers.some(a => a.question === q) && 
        q !== currentAnswering
      );
      
      if (unansweredQuestions.length > 0) {
        // Replace the answered question in displayedQuestions
        const newDisplayedQuestions = displayedQuestions.map(q => 
          q === currentAnswering ? unansweredQuestions[0] : q
        );
        setDisplayedQuestions(newDisplayedQuestions);
      }
      setCurrentAnswering(null);
    }
  };

  // If currently answering a question
  if (currentAnswering) {
    const currentQuestionNumber = answers.length + 1;
    return (
      <div className="h-full flex flex-col p-8 pt-16">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex gap-2 mb-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index < currentQuestionNumber ? 'bg-[#3D3D3D]' : 'bg-[#E8E8E8]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#9B9B9B] text-right">
            Step 3 of 3 · Question {currentQuestionNumber} of 2
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
          Choose a question to answer
        </h2>
        <p className="text-[#6B6B6B] text-sm">
          Pick one that resonates with you
        </p>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto -mx-2">
        <div className="grid grid-cols-2 gap-3 px-2">
          {displayedQuestions.map((question, index) => {
            const isAnswered = answers.some(a => a.question === question);
            
            return (
              <button
                key={index}
                onClick={() => handleSelectQuestion(question)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 text-left transition-all min-h-[120px] flex items-center justify-center relative ${
                  isAnswered
                    ? 'border-[#E8E8E8] bg-white opacity-40 cursor-not-allowed'
                    : 'border-[#E8E8E8] bg-white hover:border-[#3D3D3D] cursor-pointer'
                }`}
              >
                <p className="text-sm text-[#3D3D3D] leading-snug">
                  {question}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6">
        {/* No shuffle button */}
      </div>
    </div>
  );
}
