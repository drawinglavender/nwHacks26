import { useState } from 'react';

interface LoginScreenProps {
  onNext: (phone: string) => void;
}

export function LoginScreen({ onNext }: LoginScreenProps) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onNext(phone);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-12 bg-[#F9F9F8]">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl tracking-tight text-[#3D3D3D]">Welcome</h2>
          <p className="text-base text-[#898989] leading-relaxed">
            Enter your phone number to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full px-6 py-4 bg-white rounded-full text-[#3D3D3D] placeholder-[#C7C7C7] border border-[#E6E6E6] focus:outline-none focus:border-[#898989] transition-colors"
          />
        </form>
      </div>

      <button
        onClick={handleSubmit}
        disabled={phone.length < 10}
        className="w-full bg-[#3D3D3D] text-white py-4 rounded-full text-lg transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
