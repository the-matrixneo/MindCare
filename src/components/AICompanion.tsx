import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Bot, User, Heart, Sparkles, Volume2, VolumeX, Brain } from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function AICompanion() {
  const { messages, isProcessing, sendMessage, clearConversation } = useAI();
  const { currentLanguage, translate } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = currentLanguage.code;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
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
    };
  }, [currentLanguage]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText;
    setInputText('');
    await sendMessage(messageText, currentLanguage.code);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.lang = currentLanguage.code;
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage.code;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const conversationStarters = [
    translate('companion.starter1', "Tell me about your day"),
    translate('companion.starter2', "How are you feeling right now?"),
    translate('companion.starter3', "What's been on your mind lately?"),
    translate('companion.starter4', "Share something that made you smile today"),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gradient-text">
              <Bot className="w-8 h-8 mr-3 text-blue-400" />
              {translate('companion.title', 'AI Companion')}
            </h1>
            <p className="text-white/80 text-lg">
              {translate('companion.subtitle', 'Your personal mental health companion, available 24/7 in your language')}
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl opacity-80"
          >
            🤖
          </motion.div>
        </div>
      </motion.div>

      {/* Chat Interface */}
      <div className="glass-card overflow-hidden">
        {/* Chat Header */}
        <div className="glass-header p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-button rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Mental Health Companion</h3>
                <p className="text-sm text-white/70">
                  {translate('companion.status', 'Online')} • {translate('companion.language', 'Speaking')} {currentLanguage.nativeName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="glass-button p-2 text-white rounded-lg transition-colors"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={clearConversation}
                className="glass-button px-3 py-1 text-sm text-white rounded-lg transition-colors"
              >
                {translate('companion.clear', 'Clear Chat')}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 gradient-button rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {translate('companion.welcome', 'Welcome to your AI Companion')}
              </h3>
              <p className="text-white/70 mb-6">
                {translate('companion.welcome_desc', 'I\'m here to listen, support, and help you navigate your mental health journey.')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                {conversationStarters.map((starter, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInputText(starter)}
                    className="p-3 text-sm glass-button text-white rounded-lg hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {starter}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'gradient-button text-white'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'glass-card text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => speakMessage(message.content)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                          disabled={isSpeaking}
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {message.emotion && (
                      <div className="mt-2 text-xs opacity-70">
                        {translate('companion.emotion', 'Emotion')}: {message.emotion} 
                        ({Math.round((message.confidence || 0) * 100)}%)
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-button rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-white/60 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={translate('companion.placeholder', 'Share what\'s on your mind...')}
                className="w-full px-4 py-3 glass-card text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                disabled={isProcessing}
              />
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </motion.div>
              )}
            </div>
            
            <button
              onClick={handleVoiceInput}
              className={`glass-button p-3 rounded-xl transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white' 
                  : 'text-white hover:bg-white/20'
              }`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="p-3 gradient-button text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-3 text-xs text-white/50 text-center">
            {translate('companion.privacy', 'Your conversations are private and secure. This AI is designed to provide support, not replace professional therapy.')}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="w-12 h-12 gradient-button rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {translate('companion.feature1', 'Emotion Recognition')}
          </h3>
          <p className="text-white/70 text-sm">
            {translate('companion.feature1_desc', 'Advanced AI analyzes your text and voice to understand your emotional state and provide appropriate support.')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="w-12 h-12 gradient-button rounded-xl flex items-center justify-center mb-4">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {translate('companion.feature2', 'Voice Interaction')}
          </h3>
          <p className="text-white/70 text-sm">
            {translate('companion.feature2_desc', 'Speak naturally in your preferred language. The AI responds with voice synthesis for a more personal experience.')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="w-12 h-12 gradient-button rounded-xl flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {translate('companion.feature3', '24/7 Support')}
          </h3>
          <p className="text-white/70 text-sm">
            {translate('companion.feature3_desc', 'Always available when you need someone to talk to, providing consistent emotional support and coping strategies.')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}