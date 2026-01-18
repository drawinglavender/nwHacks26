import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFixed } from './components/OnboardingFixed';
import { OnboardingSelectable } from './components/OnboardingSelectable';
import { SoulColorResult } from './components/SoulColorResult';
import { CreateStartingPrompt } from './components/CreateStartingPrompt';
import { LiveLounge } from './components/LiveLounge';
import { HostInbox } from './components/HostInbox';
import { ChatScreen } from './components/ChatScreen';
import { TimeLimitFeedback } from './components/TimeLimitFeedback';
import { MatchConfirmation } from './components/MatchConfirmation';

export type Screen = 
  | 'login'
  | 'onboarding-fixed' 
  | 'onboarding-selectable'
  | 'soul-color' 
  | 'create-prompt'
  | 'lounge' 
  | 'inbox'
  | 'chat'
  | 'time-feedback'
  | 'match-confirmation';

export interface OnboardingAnswer {
  question: string;
  answer: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userSoulColor, setUserSoulColor] = useState({ from: '#E8C4B8', to: '#D4A89F' });
  const [selectedThought, setSelectedThought] = useState<any>(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswer[]>([]);
  const [otherUserAnswers, setOtherUserAnswers] = useState<OnboardingAnswer[]>([]);
  const [bothWantToContinue, setBothWantToContinue] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[812px] bg-[#FAF9F7] rounded-3xl shadow-2xl overflow-hidden relative">
        {currentScreen === 'login' && (
          <LoginScreen onNavigate={setCurrentScreen} />
        )}
        
        {currentScreen === 'onboarding-fixed' && (
          <OnboardingFixed 
            onNavigate={setCurrentScreen}
            onComplete={(answers) => {
              setOnboardingAnswers(answers);
              setCurrentScreen('onboarding-selectable');
            }}
          />
        )}
        
        {currentScreen === 'onboarding-selectable' && (
          <OnboardingSelectable 
            existingAnswers={onboardingAnswers}
            onNavigate={setCurrentScreen}
            onComplete={(allAnswers) => {
              setOnboardingAnswers(allAnswers);
              // Generate soul color based on answers
              const randomColor = [
                { from: '#E8C4B8', to: '#D4A89F' },
                { from: '#B8D4C4', to: '#9FBFAA' },
                { from: '#C4B8E8', to: '#A89FD4' },
                { from: '#E8D4B8', to: '#D4BF9F' },
                { from: '#B8C4E8', to: '#9FA8D4' },
              ][Math.floor(Math.random() * 5)];
              setUserSoulColor(randomColor);
              setCurrentScreen('soul-color');
            }}
          />
        )}
        
        {currentScreen === 'soul-color' && (
          <SoulColorResult 
            soulColor={userSoulColor}
            onNavigate={setCurrentScreen}
          />
        )}
        
        {currentScreen === 'create-prompt' && (
          <CreateStartingPrompt 
            userSoulColor={userSoulColor}
            onNavigate={setCurrentScreen}
          />
        )}
        
        {currentScreen === 'lounge' && (
          <LiveLounge 
            userSoulColor={userSoulColor}
            onNavigate={setCurrentScreen}
            onSelectThought={setSelectedThought}
          />
        )}
        
        {currentScreen === 'inbox' && (
          <HostInbox 
            userSoulColor={userSoulColor}
            onNavigate={setCurrentScreen}
            onAccept={(thought) => {
              setSelectedThought(thought);
              // Simulate other user's answers
              setOtherUserAnswers([
                { question: "What brings you here today?", answer: "Looking for genuine conversations" },
                { question: "What kind of conversation feels good to you?", answer: "Deep and meaningful" },
                { question: "What makes you feel alive?", answer: "Connecting with others authentically" },
                { question: "What's a question you love being asked?", answer: "What are you curious about lately?" },
              ]);
              setCurrentScreen('chat');
            }}
          />
        )}
        
        {currentScreen === 'chat' && (
          <ChatScreen 
            userSoulColor={userSoulColor}
            otherSoulColor={selectedThought?.soulColor || { from: '#B8C4E8', to: '#9FA8D4' }}
            userAnswers={onboardingAnswers}
            otherUserAnswers={otherUserAnswers}
            onNavigate={setCurrentScreen}
            onTimeEnd={() => setCurrentScreen('time-feedback')}
          />
        )}
        
        {currentScreen === 'time-feedback' && (
          <TimeLimitFeedback 
            onNavigate={setCurrentScreen}
            onContinue={(userWants) => {
              // Simulate other user's choice (50/50 for demo)
              const otherUserWants = Math.random() > 0.5;
              const bothWant = userWants && otherUserWants;
              setBothWantToContinue(bothWant);
              
              if (bothWant) {
                setCurrentScreen('match-confirmation');
              } else {
                setCurrentScreen('lounge');
              }
            }}
          />
        )}
        
        {currentScreen === 'match-confirmation' && (
          <MatchConfirmation 
            onNavigate={setCurrentScreen}
            otherSoulColor={selectedThought?.soulColor || { from: '#B8C4E8', to: '#9FA8D4' }}
            onContinueChat={() => {
              setCurrentScreen('chat');
            }}
          />
        )}
      </div>
    </div>
  );
}
