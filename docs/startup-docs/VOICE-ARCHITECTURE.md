# Farm Intellect — Voice Architecture

## Voice Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VOICE I/O ARCHITECTURE                             │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  VOICE INPUT (Speech-to-Text)                               │    │
│  │                                                             │    │
│  │  Farmer speaks    Microphone     Audio blob    Sarvam STT   │    │
│  │  in Punjabi  ──→  (browser  ──→  (WebM/WAV ──→  saaras:v3  │    │
│  │                    API)           upload)        → text     │    │
│  │                                                             │    │
│  │  "ਮੇਰੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਕੀੜੇ ਲੱਗ ਗਏ ਨੇ"                  │    │
│  └────────────────────────────────────┬────────────────────────┘    │
│                                       │                              │
│                                       ▼                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  AI PROCESSING                                              │    │
│  │                                                             │    │
│  │  Transcribed    System Prompt     Sarvam-30b     AI Reply   │    │
│  │  text       ──→  + context    ──→  LLM call  ──→  in user  │    │
│  │                   + history                       language  │    │
│  └────────────────────────────────────┬────────────────────────┘    │
│                                       │                              │
│                                       ▼                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  VOICE OUTPUT (Text-to-Speech)                              │    │
│  │                                                             │    │
│  │  AI text       Sarvam TTS      Audio data     Browser      │    │
│  │  response  ──→  bulbul:v3  ──→  (base64    ──→  plays     │    │
│  │                 + speaker       encoded)       audio       │    │
│  │                                                             │    │
│  │  "ਤੁਹਾਡੀ ਕਣਕ ਵਿੱਚ ਐਫ਼ਿਡ ਕੀੜੇ ਹੋ ਸਕਦੇ ਹਨ..."              │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  TOTAL LATENCY: Voice in → AI → Voice out ≈ 4-6 seconds            │
│  (STT ~1s + LLM ~2-3s + TTS ~1s)                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Speech-to-Text (STT) Implementation

```
┌─────────────────────────────────────────────────────────────────────┐
│  SARVAM STT (saaras:v3)                                              │
│                                                                       │
│  API ENDPOINT: https://api.sarvam.ai/speech-to-text                 │
│  METHOD: POST                                                        │
│  CONTENT-TYPE: multipart/form-data                                   │
│                                                                       │
│  FLOW:                                                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  1. User taps mic button on chat UI                          │   │
│  │  2. Browser MediaRecorder API captures audio                  │   │
│  │  3. Audio recorded as WebM/Opus or WAV format                │   │
│  │  4. Max recording: 30 seconds                                │   │
│  │  5. Audio blob sent to POST /api/chat/voice/transcribe       │   │
│  │  6. Backend sends to Sarvam STT API:                         │   │
│  │     {                                                         │   │
│  │       file: audioBlob,                                        │   │
│  │       model: "saaras:v3",                                     │   │
│  │       language_code: "pa-IN"  // from LanguageContext         │   │
│  │     }                                                         │   │
│  │  7. Sarvam returns: { transcript: "ਮੇਰੀ ਕਣਕ..." }          │   │
│  │  8. Transcript used as chat input → AI pipeline               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  LANGUAGE CODES:                                                     │
│  ┌────────────┬────────────────┐                                    │
│  │ Language   │ Code           │                                    │
│  ├────────────┼────────────────┤                                    │
│  │ Hindi      │ hi-IN          │                                    │
│  │ Punjabi    │ pa-IN          │                                    │
│  │ English    │ en-IN          │                                    │
│  │ Bengali    │ bn-IN          │                                    │
│  │ Tamil      │ ta-IN          │                                    │
│  │ Telugu     │ te-IN          │                                    │
│  │ Marathi    │ mr-IN          │                                    │
│  │ Gujarati   │ gu-IN          │                                    │
│  └────────────┴────────────────┘                                    │
│                                                                       │
│  BACKEND IMPLEMENTATION (services/sarvam.js):                        │
│  transcribeSarvamAudio(audioBuffer, language) {                      │
│    const formData = new FormData();                                  │
│    formData.append('file', audioBuffer);                            │
│    formData.append('model', 'saaras:v3');                           │
│    formData.append('language_code', language);                      │
│                                                                       │
│    return fetch('https://api.sarvam.ai/speech-to-text', {           │
│      method: 'POST',                                                 │
│      headers: { 'api-subscription-key': SARVAM_API_KEY },          │
│      body: formData                                                  │
│    });                                                               │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Text-to-Speech (TTS) Implementation

```
┌─────────────────────────────────────────────────────────────────────┐
│  SARVAM TTS (bulbul:v3)                                              │
│                                                                       │
│  API ENDPOINT: https://api.sarvam.ai/text-to-speech                 │
│  METHOD: POST                                                        │
│  CONTENT-TYPE: application/json                                      │
│                                                                       │
│  REQUEST:                                                            │
│  {                                                                   │
│    "inputs": ["AI response text in user's language"],               │
│    "target_language_code": "pa-IN",                                 │
│    "speaker": "meera",                                              │
│    "model": "bulbul:v3"                                             │
│  }                                                                   │
│                                                                       │
│  RESPONSE:                                                           │
│  {                                                                   │
│    "audios": ["base64-encoded-wav-audio-data"]                      │
│  }                                                                   │
│                                                                       │
│  AVAILABLE SPEAKERS:                                                 │
│  ┌────────────┬──────────┬──────────────────────────────────────┐   │
│  │ Speaker    │ Gender   │ Best For                              │   │
│  ├────────────┼──────────┼──────────────────────────────────────┤   │
│  │ meera      │ Female   │ General advisory (default)            │   │
│  │ pavithra   │ Female   │ Formal agricultural advice            │   │
│  │ maitreyi   │ Female   │ Friendly conversational tone          │   │
│  │ arvind     │ Male     │ Expert/authoritative voice            │   │
│  │ karthik    │ Male     │ Casual farming discussion             │   │
│  │ amol       │ Male     │ Regional dialect support              │   │
│  └────────────┴──────────┴──────────────────────────────────────┘   │
│                                                                       │
│  AUDIO PLAYBACK:                                                     │
│  1. Frontend receives base64 audio string                           │
│  2. Decode to ArrayBuffer                                            │
│  3. Create AudioContext + AudioBuffer                                │
│  4. Play via Web Audio API                                           │
│  5. Visual waveform indicator during playback                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Voice UI Components

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND VOICE INTERFACE                                            │
│                                                                       │
│  Chat Screen Layout:                                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │           Chat Message History                       │    │   │
│  │  │  ┌──────────────────────────────────────┐           │    │   │
│  │  │  │ 🧑 ਮੇਰੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਕੀੜੇ     │ (user)    │    │   │
│  │  │  └──────────────────────────────────────┘           │    │   │
│  │  │           ┌──────────────────────────────────────┐  │    │   │
│  │  │  (AI) 🤖 │ ਤੁਹਾਡੀ ਕਣਕ ਵਿੱਚ ਐਫ਼ਿਡ ਕੀੜੇ ਹੋ     │  │    │   │
│  │  │           │ ਸਕਦੇ ਹਨ। ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ...         │  │    │   │
│  │  │           └──────────────────────────┬───────────┘  │    │   │
│  │  │                                      │ [🔊 Play]   │    │   │
│  │  └──────────────────────────────────────┴──────────────┘    │   │
│  │                                                              │   │
│  │  ┌────────────────────────────┬──────────┬───────────────┐  │   │
│  │  │  Type message...           │  🎤 Mic  │  📤 Send     │  │   │
│  │  └────────────────────────────┴──────────┴───────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Mic States:                                                         │
│  ┌──────────────┬───────────────────────────────────────────────┐   │
│  │ 🎤 (grey)    │ Idle — tap to start recording                  │   │
│  │ 🔴 (red)     │ Recording — tap to stop                        │   │
│  │ ⏳ (spinner) │ Processing — sending to STT API                │   │
│  │ ✅ (green)   │ Done — text appears in input field             │   │
│  │ ❌ (error)   │ Failed — show error, fallback to keyboard      │   │
│  └──────────────┴───────────────────────────────────────────────┘   │
│                                                                       │
│  ACCESSIBILITY:                                                      │
│  • Large mic button (48×48px minimum touch target)                  │
│  • Visual recording indicator (pulsing red border)                  │
│  • Audio playback with pause/resume                                 │
│  • Auto-stop recording after 30 seconds                             │
│  • Haptic feedback on mobile (vibrate on tap)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Voice Error Handling

```
┌─────────────────────────────────────────────────────────────────────┐
│  ERROR SCENARIOS & FALLBACKS                                         │
│                                                                       │
│  ┌────────────────────────┬──────────────────────────────────────┐  │
│  │ Error                  │ Fallback                              │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ Mic permission denied  │ Show keyboard input + permission     │  │
│  │                        │ instructions in user's language      │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ STT API fails          │ Show "Please type your question"     │  │
│  │                        │ + highlight text input field         │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ TTS API fails          │ Display text response only (no audio)│  │
│  │                        │ Response still fully readable        │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ Poor audio quality     │ Ask user to re-record in quieter     │  │
│  │                        │ environment, show text input option  │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ Network timeout        │ Cache last response, show offline    │  │
│  │                        │ message with retry button            │  │
│  ├────────────────────────┼──────────────────────────────────────┤  │
│  │ Unsupported browser    │ Hide mic button, text-only mode      │  │
│  │                        │ (check navigator.mediaDevices)       │  │
│  └────────────────────────┴──────────────────────────────────────┘  │
│                                                                       │
│  DESIGN PRINCIPLE: Voice is a ENHANCEMENT, not a requirement.       │
│  Every feature works with text input alone. Voice is additive.      │
└─────────────────────────────────────────────────────────────────────┘
```
