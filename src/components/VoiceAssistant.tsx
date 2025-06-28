import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, Globe, Settings, Brain, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAI } from '../contexts/AIContext';

interface VoiceAssistantProps {
  onClose: () => void;
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9,
    pitch: 1,
    volume: 0.8
  });
  
  const { currentLanguage, supportedLanguages, changeLanguage, translate } = useLanguage();
  const { generateResponse, analyzeEmotion } = useAI();
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage.code;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentLanguage]);

  const handleVoiceInput = async (text: string) => {
    setIsProcessing(true);
    try {
      // Analyze emotion
      const emotion = await analyzeEmotion(text, currentLanguage.code);
      
      // Generate response
      const aiResponse = await generateResponse(text, { 
        language: currentLanguage.code, 
        emotion: emotion.emotion 
      });
      
      setResponse(aiResponse);
      speakResponse(aiResponse);
    } catch (error) {
      console.error('Voice processing error:', error);
      const errorMsg = translate('voice.error', 'Sorry, I encountered an error. Please try again.');
      setResponse(errorMsg);
      speakResponse(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current && text) {
      synthRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.code;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;
      utterance.volume = voiceSettings.volume;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = currentLanguage.code;
        recognitionRef.current.start();
        setIsListening(true);
        setTranscript('');
        setResponse('');
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const quickCommands = [
    { text: translate('voice.cmd1', 'How are you feeling?'), action: () => handleVoiceInput(translate('voice.cmd1', 'How are you feeling?')) },
    { text: translate('voice.cmd2', 'Tell me about your day'), action: () => handleVoiceInput(translate('voice.cmd2', 'Tell me about your day')) },
    { text: translate('voice.cmd3', 'I need support'), action: () => handleVoiceInput(translate('voice.cmd3', 'I need support')) },
    { text: translate('voice.cmd4', 'Help me relax'), action: () => handleVoiceInput(translate('voice.cmd4', 'Help me relax')) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="glass-header p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold gradient-text flex items-center">
                <Brain className="w-6 h-6 mr-2 text-blue-400" />
                {translate('voice.title', 'Voice Assistant')}
              </h3>
              <p className="text-white/80 text-sm">
                {translate('voice.subtitle', 'Speak in')} {currentLanguage.nativeName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="glass-button p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Visualizer */}
        <div className="p-8 text-center">
          <motion.div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isListening 
                ? 'bg-red-500' 
                : isProcessing
                ? 'bg-yellow-500'
                : isSpeaking
                ? 'bg-green-500'
                : 'gradient-button'
            }`}
            animate={isListening ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : isSpeaking ? (
              <Volume2 className="w-12 h-12 text-white" />
            ) : isProcessing ? (
              <Sparkles className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </motion.div>

          {/* Status */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              {isListening 
                ? translate('voice.listening', 'Listening...') 
                : isProcessing
                ? translate('voice.processing', 'Processing...')
                : isSpeaking
                ? translate('voice.speaking', 'Speaking...')
                : translate('voice.ready', 'Ready to listen')
              }
            </h4>
            
            {transcript && (
              <div className="glass-card p-3 rounded-lg mb-4">
                <p className="text-sm text-white/80">{transcript}</p>
              </div>
            )}
            
            {response && (
              <div className="glass-card p-3 rounded-lg border border-blue-400/30">
                <p className="text-sm text-white/90">{response}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <motion.button
              onClick={toggleListening}
              className={`p-4 rounded-full text-white font-semibold transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'gradient-button hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            {isSpeaking && (
              <motion.button
                onClick={stopSpeaking}
                className="p-4 glass-button hover:bg-white/20 text-white rounded-full transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <VolumeX className="w-6 h-6" />
              </motion.button>
            )}
          </div>

          {/* Quick Commands */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-white/80 mb-3">
              {translate('voice.quick_commands', 'Quick Commands')}
            </h5>
            {quickCommands.map((command, index) => (
              <button
                key={index}
                onClick={command.action}
                className="w-full p-2 text-sm glass-button hover:bg-white/20 rounded-lg transition-colors text-left text-white/80"
                disabled={isProcessing || isListening}
              >
                "{command.text}"
              </button>
            ))}
          </div>
        </div>

        {/* Language & Settings */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-white/60" />
              <select
                value={currentLanguage.code}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm glass-card text-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {supportedLanguages.slice(0, 10).map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-white/60" />
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.rate}
                onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                className="w-16"
                title="Speech Rate"
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-header p-4 text-center">
          <p className="text-xs text-white/70">
            {translate('voice.instructions', 'Tap the microphone and speak naturally. The AI will respond in your selected language.')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}