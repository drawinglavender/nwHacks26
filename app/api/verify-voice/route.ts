import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { audioBlob, phrase } = await request.json();

    if (!audioBlob || !phrase) {
      return NextResponse.json(
        { error: 'Missing audio or phrase' },
        { status: 400 }
      );
    }

    const audioBuffer = Buffer.from(audioBlob, 'base64');
    const formData = new FormData();
    formData.append('audio', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
    formData.append('model_id', 'scribe_v1');

    console.log('Sending to ElevenLabs Scribe STT:');
    console.log('- Audio buffer size:', audioBuffer.length);
    console.log('- Expected phrase:', phrase);

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
      body: formData,
    });

    const result = await response.json();
    console.log('ElevenLabs Scribe Response:', JSON.stringify(result, null, 2));
    console.log('Full response status:', response.status);
    
    // Extract transcribed text
    const transcribedText = result.text || '';
    console.log('Transcribed text:', transcribedText);

    // Compare transcribed text with expected phrase (case-insensitive, partial match)
    const normalizedTranscription = transcribedText.toLowerCase().trim();
    const normalizedPhrase = phrase.toLowerCase().trim();
    const isVerified = normalizedTranscription.includes(normalizedPhrase) || normalizedPhrase.includes(normalizedTranscription);

    return NextResponse.json({
      verified: isVerified,
      message: isVerified ? 'Verified!' : 'Phrase not recognized. Please try again.',
      debugData: {
        transcribedText: transcribedText,
        expectedPhrase: phrase,
        status: response.status,
      },
    });
  } catch (error) {
    console.error('Voice verification error:', error);
    return NextResponse.json({ 
      error: String(error),
      debugInfo: 'Check server logs for details'
    }, { status: 500 });
  }
}
