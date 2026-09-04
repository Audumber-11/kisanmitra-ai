"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Loader2,
  AlertCircle,
  Phone,
  PhoneOff,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "hi-IN", name: "हिंदी", api: "hindi" },
  { code: "mr-IN", name: "मराठी", api: "marathi" },
  { code: "te-IN", name: "తెలుగు", api: "telugu" },
  { code: "en-IN", name: "English", api: "english" },
];

// Pre-defined questions for each language
const SAMPLE_QUESTIONS = {
  hindi: [
    "मेरे टमाटर के पत्ते पीले क्यों हो रहे हैं?",
    "फसल में कीट लग गए हैं, क्या करूं?",
    "कब और कितनी सिंचाई करनी चाहिए?",
    "गेहूं के लिए कौन सी खाद अच्छी है?",
    "आने वाले दिनों में मौसम कैसा रहेगा?",
  ],
  marathi: [
    "माझ्या टोमॅटोची पाने पिवळी का होत आहेत?",
    "पिकावर कीड लागली आहे, काय करावे?",
    "कधी आणि किती सिंचन करावे?",
    "गहू साठी कोणते खत चांगले आहे?",
    "पुढील काही दिवस हवामान कसे असेल?",
  ],
  telugu: [
    "నా టమాటో ఆకులు ఎందుకు పసుపుగా మారుతున్నాయి?",
    "పంటపై పురుగులు వచ్చాయి, ఏమి చేయాలి?",
    "ఎప్పుడు ఎంత నీటిపారుస చేయాలి?",
    "గోధుమలకు ఏ ఎరువు మంచిది?",
    "రాబోయే రోజుల్లో వాతావరణం ఎలా ఉంటుంది?",
  ],
  english: [
    "Why are my tomato leaves turning yellow?",
    "There are pests on my crop, what should I do?",
    "When and how much should I irrigate?",
    "Which fertilizer is best for wheat?",
    "How will the weather be in coming days?",
  ],
};

type ConnectionState = "idle" | "connecting" | "connected" | "error";
type ConversationStep = "greeting" | "listening" | "processing" | "responding" | "complete";

interface Message {
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function VoicePage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [conversationStep, setConversationStep] = useState<ConversationStep>("greeting");
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage.code;
    }
  }, [selectedLanguage]);

  // Play greeting when call starts
  useEffect(() => {
    if (connectionState === "connected" && !hasGreeted) {
      setHasGreeted(true);
      const greetings: Record<string, string> = {
        hindi: "नमस्ते! मैं किसान मित्र AI हूं। आप क्या जानना चाहते हैं?",
        marathi: "नमस्कार! मी किसान मित्र AI आहे. तुम्हाला काय जाणून घ्यायचे आहे?",
        telugu: "నమస్కారం! నేను కిసాన్ మిత్ర AI ని. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        english: "Hello! I am KisanMitra AI. What would you like to know?",
      };
      speakText(greetings[selectedLanguage.api]);
    }
  }, [connectionState, hasGreeted, selectedLanguage]);

  // Speak text using browser TTS
  const speakText = useCallback((text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.code;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a good voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang === selectedLanguage.code
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setConversationStep("responding");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setConversationStep("complete");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setConversationStep("complete");
    };

    synthRef.current.speak(utterance);
  }, [selectedLanguage]);

  // Start voice call
  const startCall = useCallback(async () => {
    setError(null);
    setConnectionState("connecting");
    setHasGreeted(false);
    setMessages([]);

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setConnectionState("connected");
  }, []);

  // End voice call
  const endCall = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    setConnectionState("idle");
    setConversationStep("greeting");
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript("");
    setHasGreeted(false);
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    setIsListening(true);
    setConversationStep("listening");
    setTranscript("");
    setError(null);

    recognitionRef.current.lang = selectedLanguage.code;
    recognitionRef.current.start();

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;
      setTranscript(transcriptText);

      if (result.isFinal) {
        processQuery(transcriptText);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "no-speech") {
        setError("कोई आवाज नहीं सुनाई दी। कृपया फिर से कोशिश करें।");
      } else if (event.error === "not-allowed") {
        setError("कृपया माइक्रोफ़ोन की अनुमति दें।");
      } else {
        setError(`Error: ${event.error}`);
      }
      setConversationStep("complete");
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [selectedLanguage]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Process user query
  const processQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsListening(false);
    setConversationStep("processing");

    // Add user message
    const userMessage: Message = {
      role: "user",
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          language: selectedLanguage.api,
          district: "Pune",
          state: "Maharashtra",
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();

      // Add AI message
      const aiMessage: Message = {
        role: "ai",
        text: data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Speak the response
      speakText(data.response);
    } catch (err) {
      console.error("Query processing error:", err);
      const errorMsg: Record<string, string> = {
        hindi: "क्षमा करें, कुछ गलत हो गया। कृपया फिर से कोशिश करें।",
        marathi: "क्षमस्व, काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.",
        telugu: "క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
        english: "Sorry, something went wrong. Please try again.",
      };
      setError(errorMsg[selectedLanguage.api]);
      setConversationStep("complete");
    }
  }, [selectedLanguage, speakText]);

  // Use sample question
  const useSampleQuestion = useCallback((question: string) => {
    processQuery(question);
  }, [processQuery]);

  // Text input handler
  const handleTextSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    if (text.trim()) {
      processQuery(text);
      e.currentTarget.reset();
    }
  }, [processQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">Voice</span> Advisory
          </h1>
          <p className="text-muted-foreground">
            Speak directly with KisanMitra AI in your language
          </p>
        </div>

        {/* Language Selector */}
        {connectionState === "idle" && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Select Your Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage.code === lang.code ? "default" : "outline"}
                    className={cn(
                      "h-auto py-4 text-lg",
                      selectedLanguage.code === lang.code && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Call Interface */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {/* Status Bar */}
            <div
              className={cn(
                "px-6 py-3 transition-colors border-b",
                connectionState === "connected" && "bg-green-50 border-green-200",
                connectionState === "connecting" && "bg-amber-50 border-amber-200",
                connectionState === "idle" && "bg-muted/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      connectionState === "connected" && "bg-green-500 animate-pulse",
                      connectionState === "connecting" && "bg-amber-500 animate-pulse",
                      connectionState === "idle" && "bg-gray-400"
                    )}
                  />
                  <span className="text-sm font-medium">
                    {connectionState === "idle" && "Ready to Call"}
                    {connectionState === "connecting" && "Connecting..."}
                    {connectionState === "connected" && (isSpeaking ? "AI Speaking..." : isListening ? "Listening..." : "Connected")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {selectedLanguage.name}
                </span>
              </div>
            </div>

            {/* Main Area */}
            <div className="p-8 text-center">
              {connectionState === "idle" && (
                <Button
                  size="xl"
                  className="rounded-full px-12 h-20 text-lg shadow-lg shadow-primary/25"
                  onClick={startCall}
                >
                  <Phone className="h-6 w-6 mr-3" />
                  Start Voice Call
                </Button>
              )}

              {connectionState === "connecting" && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <p className="text-muted-foreground">Connecting to KisanMitra AI...</p>
                </div>
              )}

              {connectionState === "connected" && (
                <div className="space-y-6">
                  {/* Main Action Button */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isSpeaking || conversationStep === "processing"}
                      className={cn(
                        "relative w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-lg",
                        isListening
                          ? "bg-red-500 text-white"
                          : isSpeaking
                          ? "bg-blue-500 text-white"
                          : conversationStep === "processing"
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {conversationStep === "processing" ? (
                        <Loader2 className="h-12 w-12 animate-spin" />
                      ) : isSpeaking ? (
                        <Volume2 className="h-12 w-12 animate-pulse" />
                      ) : isListening ? (
                        <>
                          <MicOff className="h-12 w-12" />
                          <span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30" />
                        </>
                      ) : (
                        <Mic className="h-12 w-12" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {isSpeaking && "🔊 AI is responding..."}
                    {isListening && "🎤 Listening to you..."}
                    {conversationStep === "processing" && "⏳ Processing your question..."}
                    {!isListening && !isSpeaking && conversationStep === "complete" && "Tap microphone to ask again"}
                    {!isListening && !isSpeaking && conversationStep === "greeting" && "Starting conversation..."}
                  </p>

                  {/* Live Transcript */}
                  {transcript && (
                    <div className="bg-muted/50 rounded-xl p-4 text-left">
                      <p className="text-xs text-muted-foreground mb-1">You said:</p>
                      <p className="text-foreground italic">{transcript}</p>
                    </div>
                  )}

                  {/* End Call Button */}
                  <Button
                    variant="destructive"
                    onClick={endCall}
                    className="rounded-full"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        {messages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl p-3",
                    msg.role === "user"
                      ? "bg-primary/10 ml-12"
                      : "bg-muted mr-12"
                  )}
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {msg.role === "user" ? "👨‍🌾 You" : "🤖 KisanMitra AI"}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Sample Questions */}
        {connectionState === "idle" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Try These Questions</CardTitle>
              <CardDescription>Click any question to ask KisanMitra AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {SAMPLE_QUESTIONS[selectedLanguage.api as keyof typeof SAMPLE_QUESTIONS].map(
                  (question, idx) => (
                    <button
                      key={idx}
                      onClick={() => useSampleQuestion(question)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-primary/5 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{question}</span>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Text Input (Alternative) */}
        {connectionState === "idle" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Or Type Your Question</CardTitle>
              <CardDescription>If voice is not available, you can type</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  name="text"
                  type="text"
                  placeholder="Type your question in any language..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit">Ask</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📱 How to use:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Select your language above (Hindi/Marathi/Telugu/English)</li>
              <li>Click &quot;Start Voice Call&quot; button</li>
              <li>Allow microphone permission when asked</li>
              <li>Click the microphone button and speak your question</li>
              <li>Listen to KisanMitra AI&apos;s response</li>
              <li>Click &quot;End Call&quot; when done</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3">
              💡 <strong>Best browsers:</strong> Chrome, Edge, or Safari on desktop/mobile
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
