import React, { createContext, useContext, useState, useCallback } from 'react';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language?: string;
  emotion?: string;
  confidence?: number;
}

interface AIContextType {
  messages: AIMessage[];
  isProcessing: boolean;
  sendMessage: (content: string, language?: string) => Promise<void>;
  analyzeEmotion: (text: string, language?: string) => Promise<any>;
  generateResponse: (prompt: string, context?: any) => Promise<string>;
  clearConversation: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Simulated Google AI Edge responses for different languages
const aiResponses = {
  en: {
    greeting: "Hello! I'm your AI mental health companion. How are you feeling today?",
    empathy: "I understand that you're going through a difficult time. Your feelings are valid.",
    encouragement: "You're taking a positive step by talking about this. I'm here to support you.",
    crisis: "I'm concerned about what you've shared. Let's connect you with immediate professional help.",
    daily_check: "Tell me about your day. What moments stood out to you?",
    mood_support: "It sounds like you're experiencing some challenging emotions. Would you like to explore some coping strategies?"
  },
  hi: {
    greeting: "नमस्ते! मैं आपका AI मानसिक स्वास्थ्य साथी हूँ। आज आप कैसा महसूस कर रहे हैं?",
    empathy: "मैं समझ सकता हूँ कि आप एक कठिन समय से गुजर रहे हैं। आपकी भावनाएं वैध हैं।",
    encouragement: "इस बारे में बात करके आप एक सकारात्मक कदम उठा रहे हैं। मैं आपका साथ देने के लिए यहाँ हूँ।",
    crisis: "आपने जो साझा किया है उससे मैं चिंतित हूँ। आइए आपको तुरंत पेशेवर मदद से जोड़ते हैं।",
    daily_check: "मुझे अपने दिन के बारे में बताएं। कौन से पल आपके लिए खास थे?",
    mood_support: "लगता है आप कुछ चुनौतीपूर्ण भावनाओं का सामना कर रहे हैं। क्या आप कुछ मुकाबला रणनीतियों का पता लगाना चाहेंगे?"
  },
  es: {
    greeting: "¡Hola! Soy tu compañero de IA para la salud mental. ¿Cómo te sientes hoy?",
    empathy: "Entiendo que estás pasando por un momento difícil. Tus sentimientos son válidos.",
    encouragement: "Estás dando un paso positivo al hablar de esto. Estoy aquí para apoyarte.",
    crisis: "Me preocupa lo que has compartido. Conectemos contigo con ayuda profesional inmediata.",
    daily_check: "Cuéntame sobre tu día. ¿Qué momentos te llamaron la atención?",
    mood_support: "Parece que estás experimentando algunas emociones desafiantes. ¿Te gustaría explorar algunas estrategias de afrontamiento?"
  }
};

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateResponse = useCallback(async (prompt: string, context?: any): Promise<string> => {
    // Simulate Google AI Edge processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const language = context?.language || 'en';
    const responses = aiResponses[language as keyof typeof aiResponses] || aiResponses.en;
    
    // Simple keyword-based response selection (in real app, this would use Google AI)
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('नमस्ते') || lowerPrompt.includes('hola')) {
      return responses.greeting;
    } else if (lowerPrompt.includes('sad') || lowerPrompt.includes('depressed') || lowerPrompt.includes('उदास') || lowerPrompt.includes('triste')) {
      return responses.empathy;
    } else if (lowerPrompt.includes('help') || lowerPrompt.includes('support') || lowerPrompt.includes('मदद') || lowerPrompt.includes('ayuda')) {
      return responses.encouragement;
    } else if (lowerPrompt.includes('suicide') || lowerPrompt.includes('kill myself') || lowerPrompt.includes('आत्महत्या') || lowerPrompt.includes('suicidio')) {
      return responses.crisis;
    } else if (lowerPrompt.includes('day') || lowerPrompt.includes('today') || lowerPrompt.includes('दिन') || lowerPrompt.includes('día')) {
      return responses.daily_check;
    } else {
      return responses.mood_support;
    }
  }, []);

  const analyzeEmotion = useCallback(async (text: string, language = 'en') => {
    // Simulate emotion analysis
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const emotions = ['happy', 'sad', 'anxious', 'angry', 'neutral', 'excited', 'worried'];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = 0.7 + Math.random() * 0.3;
    
    return {
      emotion: detectedEmotion,
      confidence: confidence,
      language: language,
      suggestions: [
        'Take deep breaths',
        'Practice mindfulness',
        'Talk to someone you trust',
        'Engage in physical activity'
      ]
    };
  }, []);

  const sendMessage = useCallback(async (content: string, language = 'en') => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Analyze emotion
      const emotionAnalysis = await analyzeEmotion(content, language);
      
      // Generate AI response
      const response = await generateResponse(content, { language, emotion: emotionAnalysis.emotion });
      
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language,
        emotion: emotionAnalysis.emotion,
        confidence: emotionAnalysis.confidence
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
        language
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeEmotion, generateResponse]);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <AIContext.Provider value={{
      messages,
      isProcessing,
      sendMessage,
      analyzeEmotion,
      generateResponse,
      clearConversation
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}