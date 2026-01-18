# nwHacks26 - Soul Connection Platform

A modern connection platform built with Next.js that helps users find meaningful connections through shared interests and soul color compatibility.

## 🌟 Features

### Core Functionality
- **Soul Color Discovery**: Interactive personality assessment that generates unique soul color profiles
- **Live Lounge**: Real-time thought sharing and connection discovery
- **Chat System**: Private messaging with timed conversations and progressive profile reveals
- **Profile Management**: Onboarding process with customizable answers
- **Match Confirmation**: Mutual interest confirmation system

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live typing indicators and message delivery
- **Progressive Reveals**: Profile information revealed gradually during conversations
- **Timer System**: Time-limited conversations with extension options
- **Soul Color Algorithm**: Unique color generation based on personality traits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nwHacks26.git
cd nwHacks26
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
nwHacks26/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── ChatScreen.tsx
│   │   ├── LiveLounge.tsx
│   │   ├── MatchConfirmation.tsx
│   │   ├── SoulColorResult.tsx
│   │   ├── HostInbox.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── CreateStartingPrompt.tsx
│   │   └── LoginScreen.tsx
│   ├── lib/               # Utility libraries and services
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── storage/
│   ├── types/             # TypeScript type definitions
│   └── page.tsx           # Main application entry point
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Technologies
- **Framework**: Next.js 16.1.3 with App Router
- **Styling**: Tailwind CSS with custom configuration
- **TypeScript**: Full type safety
- **Icons**: Custom SVG components
- **State Management**: React hooks and context

## 📱 User Flow

1. **Login/Registration**: User authentication
2. **Soul Discovery**: Personality assessment → Soul color generation
3. **Live Lounge**: Browse and share thoughts
4. **Match & Chat**: Connect with compatible users
5. **Profile Reveals**: Progressive information sharing
6. **Match Confirmation**: Mutual interest verification

## 🎯 Core Concepts

### Soul Colors
Each user receives a unique soul color based on their personality assessment:
- **Gradient Generation**: Dynamic color combinations
- **Compatibility Matching**: Algorithm-based pairing
- **Visual Identity**: Consistent color representation throughout

### Progressive Reveals
Profile information is revealed gradually during conversations:
- **Message Thresholds**: Reveal at specific message counts
- **Mutual Sharing**: Both users reveal information
- **Privacy Control**: Users choose what to share

### Timed Conversations
- **Initial Timer**: 15 minute timer (30-second time limit for demo)
- **Extension Option**: Mutual agreement to continue
- **Forever Mode**: Unlimited time after mutual interest

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env.local` file for environment-specific variables:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Deploy on Vercel
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vercel Deployment](https://vercel.com/docs)
