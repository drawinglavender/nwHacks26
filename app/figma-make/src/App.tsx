import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFixed } from './components/OnboardingFixed';
import { OnboardingSelectable } from './components/OnboardingSelectable';
import { SoulColorReveal } from './components/SoulColorReveal';
import { CreatePrompt } from './components/CreatePrompt';
import { LiveLounge } from './components/LiveLounge';
import { HostInbox } from './components/HostInbox';
import { Chatroom } from './components/Chatroom';
import { ChatFeedback } from './components/ChatFeedback';
import { MatchConfirmation } from './components/MatchConfirmation';

export type Screen = 
  | 'welcome'
  | 'login'
  | 'onboarding-fixed'
  | 'onboarding-selectable'
  | 'soul-color-reveal'
  | 'create-prompt'
  | 'live-lounge'
  | 'host-inbox'
  | 'chatroom'
  | 'chat-feedback'
  | 'match-confirmation';

export interface UserData {
  phone?: string;
  soulColor: string;
  soulColorSecondary: string;
  soulColorName: string;
  soulColorDescription: string;
  onboardingAnswers: Record<string, string>;
  currentPrompt?: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState<UserData>({
    soulColor: '#F3EF81',
    soulColorSecondary: '#81E8F3',
    soulColorName: 'Sunlit Mist',
    soulColorDescription: 'Grounded and open. You listen with care and speak with intention.',
    onboardingAnswers: {},
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onNext={(phone) => {
          updateUserData({ phone });
          setCurrentScreen('onboarding-fixed');
        }} />;
      case 'onboarding-fixed':
        return <OnboardingFixed 
          onNext={(answers) => {
            updateUserData({ onboardingAnswers: { ...userData.onboardingAnswers, ...answers } });
            setCurrentScreen('onboarding-selectable');
          }} 
        />;
      case 'onboarding-selectable':
        return <OnboardingSelectable 
          onNext={(answers) => {
            updateUserData({ onboardingAnswers: { ...userData.onboardingAnswers, ...answers } });
            setCurrentScreen('soul-color-reveal');
          }} 
        />;
      case 'soul-color-reveal':
        return <SoulColorReveal 
          userData={userData}
          onNext={() => setCurrentScreen('create-prompt')} 
        />;
      case 'create-prompt':
        return <CreatePrompt 
          soulColor={userData.soulColor}
          soulColorSecondary={userData.soulColorSecondary}
          onNext={(prompt) => {
            updateUserData({ currentPrompt: prompt });
            setCurrentScreen('live-lounge');
          }} 
        />;
      case 'live-lounge':
        return <LiveLounge 
          userData={userData}
          onOpenInbox={() => setCurrentScreen('host-inbox')}
          onJoinChat={() => setCurrentScreen('chatroom')}
        />;
      case 'host-inbox':
        return <HostInbox 
          soulColor={userData.soulColor}
          onAccept={() => setCurrentScreen('chatroom')}
          onBack={() => setCurrentScreen('live-lounge')}
        />;
      case 'chatroom':
        return <Chatroom 
          userData={userData}
          onTimeEnd={() => setCurrentScreen('chat-feedback')}
        />;
      case 'chat-feedback':
        return <ChatFeedback 
          onContinue={(wantsToContinue) => {
            if (wantsToContinue) {
              setCurrentScreen('match-confirmation');
            } else {
              setCurrentScreen('live-lounge');
            }
          }}
        />;
      case 'match-confirmation':
        return <MatchConfirmation 
          onContinue={() => setCurrentScreen('chatroom')}
        />;
      default:
        return <WelcomeScreen onNext={() => setCurrentScreen('login')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderScreen()}
      </div>
    </div>
  );
}
