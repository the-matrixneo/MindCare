import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Save, Sparkles, Volume2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function MoodTracker() {
  const { user, updateUser } = useUser();
  const [currentMood, setCurrentMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

  const handleVoiceRecord = async () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Simulate voice recording and analysis
      setTimeout(() => {
        setVoiceAnalysis({
          detectedMood: 6,
          stressLevel: 4,
          energyLevel: 7,
          keyInsights: [
            'Voice tone suggests positive mood',
            'Low stress markers detected',
            'High energy levels indicated'
          ],
          recommendation: 'Your voice analysis suggests you\'re feeling quite positive today! Consider channeling this energy into creative activities.'
        });
        setCurrentMood(6);
        setAnxiety(4);
        setEnergy(7);
        setIsRecording(false);
      }, 3000);
    } else {
      setVoiceAnalysis(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const moodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      anxiety: anxiety,
      energy: energy,
      notes: notes,
      voiceAnalysis: voiceAnalysis,
    };

    // Simulate save delay
    setTimeout(() => {
      const updatedHistory = [moodEntry, ...user.moodHistory.slice(0, 29)];
      updateUser({ moodHistory: updatedHistory });
      setIsSaving(false);
      
      // Reset form
      setNotes('');
      setVoiceAnalysis(null);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How are you feeling today?</h1>
        <p className="text-gray-600 text-lg">Track your mood with AI-powered voice analysis</p>
      </motion.div>

      {/* Voice Recording Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice Mood Analysis</h3>
          <p className="text-gray-600 mb-6">Tell us about your day and let AI analyze your emotional state</p>
          
          <motion.button
            onClick={handleVoiceRecord}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
              isRecording 
                ? 'bg-crisis-500 animate-pulse shadow-2xl' 
                : 'bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRecording ? (
              <>
                <MicOff className="w-8 h-8" />
                <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-75" />
              </>
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </motion.button>
          
          <p className="mt-4 text-sm text-gray-500">
            {isRecording ? 'Recording... Speak naturally about how you feel' : 'Tap to start voice analysis'}
          </p>
          
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-center items-center space-x-2"
            >
              <Volume2 className="w-5 h-5 text-primary-500" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-8 bg-primary-500 rounded-full"
                    animate={{
                      scaleY: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Voice Analysis Results */}
        {voiceAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-healing-50 rounded-xl border border-primary-200"
          >
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-primary-500 mr-2" />
              <h4 className="font-semibold text-gray-900">AI Voice Analysis Results</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{voiceAnalysis.detectedMood}/10</div>
                <div className="text-sm text-gray-600">Mood Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warm-600">{voiceAnalysis.stressLevel}/10</div>
                <div className="text-sm text-gray-600">Stress Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-healing-600">{voiceAnalysis.energyLevel}/10</div>
                <div className="text-sm text-gray-600">Energy Level</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Key Insights:</h5>
              <ul className="space-y-1">
                {voiceAnalysis.keyInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                    {insight}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-healing-50 rounded-lg">
                <p className="text-sm text-gray-700">{voiceAnalysis.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Manual Mood Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Manual Mood Entry</h3>
        
        {/* Mood Slider */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700 font-medium">Overall Mood</label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{moodEmojis[Math.floor((currentMood - 1) / 2)]}</span>
                <span className="text-sm text-gray-600">{moodLabels[Math.floor((currentMood - 1) / 2)]}</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-crisis-200 via-warm-200 to-healing-200 rounded-lg appearance-none cursor-pointer mood-slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1</span>
              <span className="font-medium">{currentMood}</span>
              <span>10</span>
            </div>
          </div>

          {/* Anxiety Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700 font-medium">Anxiety Level</label>
              <span className="text-sm text-gray-600">{anxiety}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-healing-200 to-warm-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-gray-700 font-medium">Energy Level</label>
              <span className="text-sm text-gray-600">{energy}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-primary-200 to-healing-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8">
          <label className="block text-gray-700 font-medium mb-3">Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind? Any specific events or thoughts affecting your mood?"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 bg-gradient-to-r from-primary-500 to-healing-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSaving ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Saving Entry...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Save className="w-5 h-5 mr-2" />
              Save Mood Entry
            </div>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}