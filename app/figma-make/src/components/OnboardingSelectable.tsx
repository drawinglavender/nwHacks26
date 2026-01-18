import { useState } from 'react';
import { Shuffle } from 'lucide-react';

interface OnboardingSelectableProps {
  onNext: (answers: Record<string, string>) => void;
}

const QUESTION_POOL = [
  "What's a belief you used to hold but changed your mind about?",
  "When do you feel most like yourself?",
  "What's something you're learning right now?",
  "What does home mean to you?",
  "What's a small thing that makes a day feel lighter?",
  "What do you think people misunderstand about you?",
  "What's a conversation you wish you could have more often?",
  "What brings you peace?",
  "What's something you've been thinking about lately?",
  "What's a question you don't have an answer to yet?",
  "When do you feel most connected to others?",
  "What's something you value that's hard to put into words?",
];

export function OnboardingSelectable({ onNext }: OnboardingSelectableProps) {
  const [currentQuestions, setCurrentQuestions] = useState<string[]>(() => 
    shuffleArray([...QUESTION_POOL]).slice(0, 6)
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answeringQuestion, setAnsweringQuestion] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const handleShuffle = () => {
    setCurrentQuestions(shuffleArray([...QUESTION_POOL]).slice(0, 6));
    setSelectedQuestions([]);
    setAnswers({});
    setAnsweringQuestion(null);
  };

  const handleSelectQuestion = (question: string) => {
    if (selectedQuestions.length < 2 && !selectedQuestions.includes(question)) {
      setSelectedQuestions([...selectedQuestions, question]);
      setAnsweringQuestion(question);
    }
  };

  const handleSubmitAnswer = () => {
    if (answeringQuestion && currentAnswer.trim()) {
      const newAnswers = { ...answers, [answeringQuestion]: currentAnswer };
      setAnswers(newAnswers);
      setCurrentAnswer('');
      
      if (selectedQuestions.length === 2) {
        setTimeout(() => {
          onNext(newAnswers);
        }, 300);
      } else {
        setAnsweringQuestion(null);
      }
    }
  };

  if (answeringQuestion) {
    return (
      <div className="min-h-screen flex flex-col justify-between px-6 py-12 bg-[#F9F9F8]">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <p className="text-xs text-[#898989] uppercase tracking-wide">
            Question {selectedQuestions.indexOf(answeringQuestion) + 1} of 2
          </p>
          <h2 className="text-2xl tracking-tight text-[#3D3D3D] leading-relaxed">
            {answeringQuestion}
          </h2>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Take your time..."
            rows={6}
            className="w-full px-6 py-4 bg-white rounded-3xl text-[#3D3D3D] placeholder-[#C7C7C7] border border-[#E6E6E6] focus:outline-none focus:border-[#898989] transition-colors resize-none"
          />
        </div>

        <button
          onClick={handleSubmitAnswer}
          disabled={!currentAnswer.trim()}
          className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-[#F9F9F8]">
      <div className="mb-8 space-y-3">
        <h2 className="text-2xl tracking-tight text-[#3D3D3D]">
          Choose 2 questions to answer
        </h2>
        <p className="text-sm text-[#898989]">
          Selected: {selectedQuestions.length} of 2
        </p>
      </div>

      <div className="flex-1 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {currentQuestions.map((question) => {
            const isSelected = selectedQuestions.includes(question);
            const isAnswered = answers[question];
            
            return (
              <button
                key={question}
                onClick={() => handleSelectQuestion(question)}
                disabled={selectedQuestions.length >= 2 && !isSelected}
                className={`p-4 rounded-3xl text-left text-sm leading-relaxed transition-all ${
                  isAnswered
                    ? 'bg-[#3D3D3D] text-white border-2 border-[#3D3D3D]'
                    : isSelected
                    ? 'bg-white text-[#3D3D3D] border-2 border-[#3D3D3D]'
                    : 'bg-white text-[#5A5A5A] border border-[#E6E6E6] hover:border-[#898989]'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {question}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleShuffle}
          className="w-full flex items-center justify-center gap-2 py-3 text-[#898989] hover:text-[#3D3D3D] transition-colors"
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle questions</span>
        </button>
      </div>
    </div>
  );
}
