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

// Enhanced emotion analysis with more sophisticated patterns
const emotionPatterns = {
  happy: {
    keywords: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'perfect', 'awesome', 'brilliant', 'excellent'],
    phrases: ['feeling good', 'on top of the world', 'over the moon', 'having a blast'],
    score: 8
  },
  sad: {
    keywords: ['sad', 'depressed', 'down', 'blue', 'miserable', 'heartbroken', 'devastated', 'gloomy', 'melancholy'],
    phrases: ['feeling down', 'in the dumps', 'under the weather'],
    score: 3
  },
  anxious: {
    keywords: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'overwhelmed', 'tense', 'uneasy', 'restless'],
    phrases: ['on edge', 'butterflies in stomach', 'can\'t relax'],
    score: 4
  },
  angry: {
    keywords: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'livid', 'outraged'],
    phrases: ['fed up', 'had enough', 'boiling mad'],
    score: 4
  },
  calm: {
    keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'zen', 'balanced'],
    phrases: ['at peace', 'feeling centered', 'completely relaxed'],
    score: 7
  },
  excited: {
    keywords: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic', 'eager', 'hyped'],
    phrases: ['can\'t wait', 'so excited', 'full of energy'],
    score: 9
  },
  tired: {
    keywords: ['tired', 'exhausted', 'drained', 'weary', 'fatigued', 'sleepy', 'worn out'],
    phrases: ['running on empty', 'dead tired', 'completely drained'],
    score: 4
  }
};

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
    // Simulate emotion analysis with more sophisticated logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerText = text.toLowerCase();
    let detectedEmotion = 'neutral';
    let confidence = 0.5;
    let moodScore = 5;
    
    // Analyze text for emotional patterns
    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      let emotionScore = 0;
      
      // Check keywords
      for (const keyword of pattern.keywords) {
        if (lowerText.includes(keyword)) {
          emotionScore += 1;
        }
      }
      
      // Check phrases
      for (const phrase of pattern.phrases) {
        if (lowerText.includes(phrase)) {
          emotionScore += 2; // Phrases have higher weight
        }
      }
      
      // If this emotion has a higher score, update detection
      if (emotionScore > 0) {
        const emotionConfidence = Math.min(0.95, 0.6 + (emotionScore * 0.1));
        if (emotionConfidence > confidence) {
          detectedEmotion = emotion;
          confidence = emotionConfidence;
          moodScore = pattern.score;
        }
      }
    }
    
    // Add some randomness for more realistic variation
    confidence = Math.max(0.6, confidence + (Math.random() * 0.2 - 0.1));
    moodScore = Math.max(1, Math.min(10, moodScore + (Math.random() * 2 - 1)));
    
    return {
      emotion: detectedEmotion,
      confidence: confidence,
      moodScore: Math.round(moodScore),
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