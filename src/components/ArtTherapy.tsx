import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sparkles, Download, RefreshCw, Heart, Lock } from 'lucide-react';
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

  const moodOptions = [
    { id: 'anxious', label: 'Anxious', color: 'from-warm-400 to-warm-500', emoji: '😰' },
    { id: 'depressed', label: 'Down', color: 'from-blue-400 to-blue-500', emoji: '😔' },
    { id: 'stressed', label: 'Stressed', color: 'from-red-400 to-red-500', emoji: '😤' },
    { id: 'calm', label: 'Seeking Calm', color: 'from-healing-400 to-healing-500', emoji: '😌' },
    { id: 'creative', label: 'Creative', color: 'from-purple-400 to-purple-500', emoji: '🎨' },
    { id: 'energetic', label: 'Energetic', color: 'from-yellow-400 to-yellow-500', emoji: '⚡' },
  ];

  const artStyles = [
    { id: 'watercolor', label: 'Watercolor', description: 'Gentle, flowing therapeutic art' },
    { id: 'abstract', label: 'Abstract', description: 'Express emotions through shapes' },
    { id: 'nature', label: 'Nature Scene', description: 'Calming natural landscapes' },
    { id: 'mandala', label: 'Mandala', description: 'Meditative circular patterns' },
  ];

  const therapeuticImages = {
    anxious: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    depressed: 'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800',
    stressed: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
    calm: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
    creative: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
    energetic: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
  };

  const handleGenerate = async () => {
    const usageCheck = checkUsageLimit('artTherapy');
    
    if (!usageCheck.allowed) {
      setShowUpgrade(true);
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI art generation
    setTimeout(() => {
      const artData = {
        image: therapeuticImages[selectedMood] || therapeuticImages.calm,
        prompt: `${preferences.style} style ${selectedMood} therapeutic art with ${preferences.colors} colors in ${preferences.theme} theme`,
        mood: selectedMood,
        style: preferences.style,
        therapeutic_benefits: getTherapeuticBenefits(selectedMood),
        generated_at: new Date().toISOString(),
      };
      
      setGeneratedArt(artData);
      trackUsage('artTherapy');
      setIsGenerating(false);
    }, 3000);
  };

  const getTherapeuticBenefits = (mood) => {
    const benefits = {
      anxious: ['Promotes relaxation', 'Reduces cortisol levels', 'Encourages mindful breathing'],
      depressed: ['Boosts mood', 'Increases serotonin', 'Provides hope visualization'],
      stressed: ['Lowers blood pressure', 'Activates parasympathetic nervous system', 'Improves focus'],
      calm: ['Maintains emotional balance', 'Enhances meditation', 'Deepens self-awareness'],
      creative: ['Stimulates innovation', 'Increases dopamine', 'Enhances problem-solving'],
      energetic: ['Channels positive energy', 'Motivates action', 'Builds confidence'],
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Palette className="w-8 h-8 mr-3 text-primary-500" />
          AI Art Therapy
        </h1>
        <p className="text-gray-600 text-lg">Create personalized therapeutic art based on your emotional state</p>
        
        {/* Usage Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
          <div className={`px-3 py-1 rounded-full ${usageLimit.allowed ? 'bg-healing-100 text-healing-700' : 'bg-warm-100 text-warm-700'}`}>
            {usageLimit.remaining === -1 ? '✨ Unlimited' : `${usageLimit.remaining} sessions remaining today`}
          </div>
          {user.profile.tier === 'free' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-primary-600 hover:text-primary-700 font-medium"
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
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How are you feeling?</h3>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMood === mood.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{mood.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Art Style Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Art Style</h3>
            <div className="space-y-3">
              {artStyles.map((style) => (
                <motion.label
                  key={style.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    preferences.style === style.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerate}
            disabled={!selectedMood || isGenerating || !usageLimit.allowed}
            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              !selectedMood || isGenerating || !usageLimit.allowed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-healing-500 text-white hover:shadow-xl'
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
                <Sparkles className="w-5 h-5 mr-2" />
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
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Therapeutic Art</h3>
            {generatedArt && (
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-healing-600 rounded-lg hover:bg-gray-100">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
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
                      className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600">Creating your personalized art...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                </motion.div>
              )}

              {generatedArt && !isGenerating && (
                <motion.div
                  key="art"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full"
                >
                  <img
                    src={generatedArt.image}
                    alt="Generated therapeutic art"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {!generatedArt && !isGenerating && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="text-center text-gray-500">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select your mood and generate therapeutic art</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Therapeutic Benefits */}
          {generatedArt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-healing-50 to-primary-50 rounded-xl border border-healing-200"
            >
              <div className="flex items-center mb-3">
                <Heart className="w-5 h-5 text-healing-500 mr-2" />
                <h4 className="font-semibold text-gray-900">Therapeutic Benefits</h4>
              </div>
              <ul className="space-y-2">
                {generatedArt.therapeutic_benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-1.5 h-1.5 bg-healing-500 rounded-full mr-3" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Recent Art Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Art Journey</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={`https://images.pexels.com/photos/${1562058 + i}/pexels-photo-${1562058 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                alt={`Previous art ${i}`}
                className="w-full h-full object-cover opacity-60"
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
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Unlock Unlimited Art Therapy</h3>
              <p className="text-gray-600 mb-6">
                You've reached your daily limit of {user.limits.artTherapy} art therapy session{user.limits.artTherapy > 1 ? 's' : ''}. 
                Upgrade to Premium for unlimited therapeutic art generation.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Maybe Later
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-healing-500 text-white rounded-lg">
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