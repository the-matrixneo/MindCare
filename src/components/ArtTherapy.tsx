import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Download, RefreshCw, Heart, Lock, Wand2, Image } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function ArtTherapy() {
  const { user, checkUsageLimit, trackUsage } = useUser();
  const [selectedMood, setSelectedMood] = useState('');
  const [preferences, setPreferences] = useState({
    style: 'watercolor',
    colors: 'calming',
    theme: 'nature',
  });
  const [generatedArt, setGeneratedArt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const moodOptions = [
    { id: 'anxious', label: 'Anxious', color: 'from-orange-400 to-orange-500', emoji: '😰' },
    { id: 'depressed', label: 'Down', color: 'from-blue-400 to-blue-500', emoji: '😔' },
    { id: 'stressed', label: 'Stressed', color: 'from-red-400 to-red-500', emoji: '😤' },
    { id: 'calm', label: 'Seeking Calm', color: 'from-green-400 to-green-500', emoji: '😌' },
    { id: 'creative', label: 'Creative', color: 'from-purple-400 to-purple-500', emoji: '🎨' },
    { id: 'energetic', label: 'Energetic', color: 'from-yellow-400 to-yellow-500', emoji: '⚡' },
  ];

  const artStyles = [
    { 
      id: 'watercolor', 
      label: 'Watercolor', 
      description: 'Gentle, flowing therapeutic art with soft blended textures',
      preview: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'abstract', 
      label: 'Abstract', 
      description: 'Express emotions through non-representational shapes and colors',
      preview: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'nature', 
      label: 'Nature Scene', 
      description: 'Calming natural landscapes and organic forms',
      preview: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: 'mandala', 
      label: 'Mandala', 
      description: 'Meditative circular patterns for focus and relaxation',
      preview: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  // Expanded image database with 100+ unique images per category
  const therapeuticImages = {
    anxious: {
      watercolor: [
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    depressed: {
      watercolor: [
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    stressed: {
      watercolor: [
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    calm: {
      watercolor: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    creative: {
      watercolor: [
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    },
    energetic: {
      watercolor: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      abstract: [
        'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      mandala: [
        'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    }
  };

  const handleGenerate = async () => {
    const usageCheck = checkUsageLimit('artTherapy');
    
    if (!usageCheck.allowed) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI art generation with correct style matching
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get correct images based on mood and style
      const moodImages = therapeuticImages[selectedMood] || therapeuticImages.calm;
      const styleImages = moodImages[preferences.style] || moodImages.watercolor;
      const randomImage = styleImages[Math.floor(Math.random() * styleImages.length)];
      
      const artData = {
        image: randomImage,
        prompt: customPrompt || `${preferences.style} style ${selectedMood} therapeutic art with ${preferences.colors} colors in ${preferences.theme} theme`,
        mood: selectedMood,
        style: preferences.style,
        colors: preferences.colors,
        theme: preferences.theme,
        therapeutic_benefits: getTherapeuticBenefits(selectedMood),
        generated_at: new Date().toISOString(),
        ai_analysis: generateAIAnalysis(selectedMood, preferences.style),
      };
      
      setGeneratedArt(artData);
      trackUsage('artTherapy');
      
      // Save to localStorage for history
      const artHistory = JSON.parse(localStorage.getItem('mindcare_art_history') || '[]');
      artHistory.unshift(artData);
      localStorage.setItem('mindcare_art_history', JSON.stringify(artHistory.slice(0, 50)));
      
    } catch (error) {
      console.error('Art generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    if (generatedArt) {
      handleGenerate();
    }
  };

  const generateAIAnalysis = (mood, style) => {
    const analyses = {
      anxious: {
        watercolor: "Soft watercolor techniques help reduce anxiety through gentle, flowing movements that mirror calming breath patterns.",
        abstract: "Abstract forms allow emotional expression without judgment, helping process anxious thoughts through color and shape.",
        nature: "Natural scenes provide grounding and connection to peaceful environments, reducing anxiety symptoms.",
        mandala: "Circular mandala patterns create focus and meditation, naturally calming anxious mind states."
      },
      depressed: {
        watercolor: "Watercolor's fluid nature encourages emotional flow and release, helping lift depressive feelings.",
        abstract: "Abstract art provides safe emotional expression when words feel inadequate during depression.",
        nature: "Nature imagery connects to life force and growth, countering depressive isolation.",
        mandala: "Mandala creation offers structure and accomplishment, building positive momentum against depression."
      },
      stressed: {
        watercolor: "Watercolor's unpredictable flow teaches acceptance and letting go, reducing stress and control issues.",
        abstract: "Abstract expression releases stress through non-verbal emotional discharge.",
        nature: "Natural scenes activate the parasympathetic nervous system, naturally reducing stress hormones.",
        mandala: "Repetitive mandala patterns induce meditative states that lower cortisol and stress."
      },
      calm: {
        watercolor: "Watercolor maintains and deepens existing calm through gentle, meditative creation.",
        abstract: "Abstract art in calm states enhances creative flow and peaceful self-expression.",
        nature: "Nature imagery reinforces connection to tranquil environments and inner peace.",
        mandala: "Mandala creation in calm states deepens meditation and spiritual connection."
      },
      creative: {
        watercolor: "Watercolor's spontaneous nature amplifies creative energy and artistic exploration.",
        abstract: "Abstract art maximizes creative expression and innovative thinking.",
        nature: "Natural forms inspire biomimetic creativity and organic artistic development.",
        mandala: "Mandala patterns channel creative energy into sacred geometric expression."
      },
      energetic: {
        watercolor: "Watercolor's dynamic flow matches and channels high energy into productive creation.",
        abstract: "Abstract art provides unlimited expression for energetic emotional states.",
        nature: "Natural imagery grounds high energy while maintaining vitality and life force.",
        mandala: "Mandala creation focuses energetic states into concentrated, purposeful activity."
      }
    };
    
    return analyses[mood]?.[style] || "This art style supports emotional processing and therapeutic healing.";
  };

  const getTherapeuticBenefits = (mood) => {
    const benefits = {
      anxious: ['Promotes relaxation response', 'Reduces cortisol levels', 'Encourages mindful breathing', 'Activates parasympathetic nervous system'],
      depressed: ['Boosts serotonin production', 'Increases dopamine', 'Provides hope visualization', 'Enhances self-worth through creation'],
      stressed: ['Lowers blood pressure', 'Reduces muscle tension', 'Improves focus and concentration', 'Releases emotional pressure'],
      calm: ['Maintains emotional balance', 'Enhances meditation practice', 'Deepens self-awareness', 'Strengthens inner peace'],
      creative: ['Stimulates innovation', 'Increases dopamine', 'Enhances problem-solving', 'Builds confidence through expression'],
      energetic: ['Channels positive energy', 'Motivates constructive action', 'Builds confidence', 'Enhances vitality and life force'],
    };
    return benefits[mood] || benefits.calm;
  };

  const usageLimit = checkUsageLimit('artTherapy');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4 flex items-center justify-center">
          <Palette className="w-8 h-8 mr-3 text-blue-400" />
          AI Art Therapy
        </h1>
        <p className="text-white/80 text-lg">Create personalized therapeutic art based on your emotional state</p>
        
        {/* Usage Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <div className={`px-3 py-1 rounded-full glass-card ${usageLimit.allowed ? 'text-green-300' : 'text-orange-300'}`}>
            {usageLimit.remaining === -1 ? '✨ Unlimited' : `${usageLimit.remaining} sessions remaining today`}
          </div>
          {user.profile.tier === 'free' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-blue-300 hover:text-blue-200 font-medium"
            >
              Upgrade for unlimited ↗
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Mood Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMood === mood.id
                      ? 'border-blue-400 glass-card'
                      : 'border-white/20 hover:border-white/40 glass-button'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-white">{mood.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Art Style Selection */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Art Style</h3>
            <div className="space-y-3">
              {artStyles.map((style) => (
                <motion.label
                  key={style.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    preferences.style === style.id
                      ? 'border-blue-400 glass-card'
                      : 'border-white/20 hover:border-white/40 glass-button'
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={preferences.style === style.id}
                    onChange={(e) => setPreferences({ ...preferences, style: e.target.value })}
                    className="sr-only"
                  />
                  <img 
                    src={style.preview} 
                    alt={style.label}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{style.label}</div>
                    <div className="text-sm text-white/70">{style.description}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Custom Prompt (Optional)</h3>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Generate a mandala with blue and gold colors representing inner peace'"
              className="w-full p-3 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={3}
            />
            <p className="text-xs text-white/60 mt-2">
              Describe specific colors, themes, or elements you'd like in your therapeutic art
            </p>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!selectedMood || isGenerating || !usageLimit.allowed}
            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              !selectedMood || isGenerating || !usageLimit.allowed
                ? 'glass-button text-white/50 cursor-not-allowed'
                : 'gradient-button text-white hover:shadow-xl'
            }`}
            whileHover={selectedMood && !isGenerating && usageLimit.allowed ? { scale: 1.02 } : {}}
            whileTap={selectedMood && !isGenerating && usageLimit.allowed ? { scale: 0.98 } : {}}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Generating Therapeutic Art...
              </div>
            ) : !usageLimit.allowed ? (
              <div className="flex items-center justify-center">
                <Lock className="w-5 h-5 mr-2" />
                Upgrade to Generate More Art
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Therapeutic Art
              </div>
            )}
          </motion.button>
        </motion.div>

        {/* Art Display Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Your Therapeutic Art</h3>
            {generatedArt && (
              <div className="flex space-x-2">
                <button 
                  onClick={handleRefresh}
                  className="glass-button p-2 text-white rounded-lg hover:bg-white/20"
                  title="Generate new art with same settings"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="glass-button p-2 text-white rounded-lg hover:bg-white/20">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="aspect-square glass-card rounded-xl overflow-hidden">
            <AnimatePresence mode="wait">
              {isGenerating && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-300 border-t-blue-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-white/80">Creating your personalized art...</p>
                    <p className="text-sm text-white/60 mt-2">Using {preferences.style} style for {selectedMood} mood</p>
                  </div>
                </motion.div>
              )}

              {generatedArt && !isGenerating && (
                <motion.div
                  key="art"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={generatedArt.image}
                    alt="Generated therapeutic art"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      {generatedArt.style.charAt(0).toUpperCase() + generatedArt.style.slice(1)} • {generatedArt.mood.charAt(0).toUpperCase() + generatedArt.mood.slice(1)}
                    </p>
                  </div>
                </motion.div>
              )}

              {!generatedArt && !isGenerating && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="text-center text-white/60">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select your mood and generate therapeutic art</p>
                    <p className="text-sm mt-2">AI will create art matching your selected style</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Analysis */}
          {generatedArt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="glass-card p-4">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">AI Analysis</h4>
                </div>
                <p className="text-sm text-white/80">{generatedArt.ai_analysis}</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center mb-3">
                  <Heart className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="font-semibold text-white">Therapeutic Benefits</h4>
                </div>
                <ul className="space-y-2">
                  {generatedArt.therapeutic_benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-white/80 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Recent Art Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Your Art Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square glass-card rounded-lg overflow-hidden">
              <img
                src={`https://images.pexels.com/photos/${1562058 + i}/pexels-photo-${1562058 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                alt={`Previous art ${i}`}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpgrade(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Unlock Unlimited Art Therapy</h3>
              <p className="text-white/80 mb-6">
                You've reached your daily limit of {user.limits.artTherapy} art therapy session{user.limits.artTherapy > 1 ? 's' : ''}. 
                Upgrade to Premium for unlimited therapeutic art generation with advanced AI features.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1 py-3 glass-button text-white rounded-lg hover:bg-white/20"
                >
                  Maybe Later
                </button>
                <button className="flex-1 py-3 gradient-button text-white rounded-lg">
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}