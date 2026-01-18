import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Check } from 'lucide-react';

interface VoiceVerificationProps {
  onVerified: () => void;
}

export function VoiceVerification({ onVerified }: VoiceVerificationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const phrase = "The quick brown fox jumps over the lazy dog";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 10) stopRecording();
          return prev + 1;
        });
      }, 1000);
    } catch {
      setErrorMessage('Microphone access denied');
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current.onstop = verifyVoice;
    }
  };

  const verifyVoice = async () => {
    setStatus('verifying');
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const response = await fetch('/api/verify-voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBlob: base64Audio, phrase }),
        });
        const result = await response.json();
        if (result.verified) {
          setStatus('success');
          setTimeout(onVerified, 1500);
        } else {
          setErrorMessage(result.message || 'Verification failed');
          setStatus('error');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch {
      setErrorMessage('Error processing audio');
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-8">
        <h2 className="text-2xl font-semibold text-[#3D3D3D] mb-2 text-center">Verify You're Human</h2>
        <p className="text-[#6B6B6B] text-center mb-6">Read this phrase aloud:</p>

        <div className="bg-[#FAF9F7] rounded-xl p-6 mb-8 border border-[#E8E8E8]">
          <p className="text-xl text-[#3D3D3D] font-medium text-center">"{phrase}"</p>
        </div>

        <div className="space-y-4">
          {status === 'idle' && (
            <button onClick={startRecording} className="w-full py-4 bg-[#3D3D3D] text-white rounded-full text-lg font-medium hover:bg-[#2D2D2D] flex items-center justify-center gap-3">
              <Mic className="w-5 h-5" /> Start Recording
            </button>
          )}

          {status === 'recording' && (
            <>
              <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-medium">Recording: {recordingTime}s</span>
              </div>
              <button onClick={stopRecording} className="w-full py-4 bg-red-500 text-white rounded-full text-lg font-medium hover:bg-red-600 flex items-center justify-center gap-3">
                <MicOff className="w-5 h-5" /> Stop
              </button>
            </>
          )}

          {status === 'verifying' && <div className="text-center py-6">Verifying...</div>}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 py-6 bg-green-50 rounded-xl">
              <Check className="w-6 h-6 text-green-600" />
              <span className="text-lg font-medium text-green-600">Verified!</span>
            </div>
          )}

          {status === 'error' && (
            <>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-red-600 text-center">{errorMessage}</p>
              </div>
              <button onClick={() => setStatus('idle')} className="w-full py-4 bg-[#3D3D3D] text-white rounded-full text-lg font-medium hover:bg-[#2D2D2D] flex items-center justify-center gap-3">
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
