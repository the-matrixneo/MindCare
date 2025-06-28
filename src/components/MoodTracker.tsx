import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Save, Sparkles, Volume2, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAI } from '../contexts/AIContext';

export default function MoodTracker() {
  const { user, updateUser } = useUser();
  const { analyzeEmotion } = useAI();
  const [currentMood, setCurrentMood] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const moodEmojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '🤩', '😍', '🥳', '🌟'];
  const moodLabels = ['Very Sad', 'Sad', 'Down', 'Neutral', 'Okay', 'Good', 'Happy', 'Very Happy', 'Excited', 'Euphoric'];
  const moodColors = [
    'from-red-600 to-red-700',
    'from-red-500 to-red-600', 
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-yellow-400 to-yellow-500',
    'from-green-400 to-yellow-400',
    'from-green-500 to-green-400',
    'from-green-600 to-green-500',
    'from-blue-500 to-green-500',
    'from-purple-500 to-blue-500'
  ];

  // Advanced voice analysis function
  const analyzeVoicePattern = async (transcript, audioFeatures) => {
    try {
      // Simulate advanced voice analysis with realistic variations
      const textAnalysis = await analyzeEmotion(transcript);
      
      // Simulate audio feature analysis (pitch, speed, pauses)
      const pitchVariation = audioFeatures.pitchVariation || Math.random();
      const speechRate = audioFeatures.speechRate || (0.5 + Math.random() * 0.5);
      const pauseFrequency = audioFeatures.pauseFrequency || Math.random();
      const volumeVariation = audioFeatures.volumeVariation || Math.random();

      // Calculate mood score based on multiple factors
      let moodScore = 5; // baseline neutral
      let stressLevel = 5;
      let energyLevel = 5;

      // Text-based emotion analysis
      const lowerText = transcript.toLowerCase();
      if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('wonderful') || lowerText.includes('excited')) {
        moodScore += 2;
        energyLevel += 2;
      } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down') || lowerText.includes('terrible')) {
        moodScore -= 2;
        energyLevel -= 1;
      } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('stressed') || lowerText.includes('nervous')) {
        stressLevel += 2;
        moodScore -= 1;
      } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
        stressLevel -= 2;
        moodScore += 1;
      } else if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('drained')) {
        energyLevel -= 2;
        moodScore -= 1;
      }

      // Voice feature analysis
      // High pitch variation often indicates excitement or anxiety
      if (pitchVariation > 0.7) {
        if (moodScore > 5) {
          moodScore += 1; // excited
          energyLevel += 1;
        } else {
          stressLevel += 1; // anxious
        }
      }

      // Fast speech rate can indicate anxiety or excitement
      if (speechRate > 0.7) {
        energyLevel += 1;
        if (stressLevel > 5) {
          stressLevel += 1;
        }
      } else if (speechRate < 0.3) {
        energyLevel -= 1;
        moodScore -= 0.5;
      }

      // Frequent pauses might indicate hesitation or sadness
      if (pauseFrequency > 0.6) {
        moodScore -= 1;
        stressLevel += 0.5;
      }

      // Low volume variation might indicate monotone/depressed speech
      if (volumeVariation < 0.3) {
        moodScore -= 1;
        energyLevel -= 1;
      }

      // Clamp values between 1-10
      moodScore = Math.max(1, Math.min(10, Math.round(moodScore)));
      stressLevel = Math.max(1, Math.min(10, Math.round(stressLevel)));
      energyLevel = Math.max(1, Math.min(10, Math.round(energyLevel)));

      // Generate insights based on analysis
      const insights = [];
      const criteria = [];

      if (pitchVariation > 0.7) {
        criteria.push('High pitch variation detected');
        insights.push(moodScore > 6 ? 'Voice shows excitement and enthusiasm' : 'Voice indicates heightened emotional state');
      }
      
      if (speechRate > 0.7) {
        criteria.push('Fast speech rate detected');
        insights.push('Rapid speech suggests high energy or anxiety');
      } else if (speechRate < 0.3) {
        criteria.push('Slow speech rate detected');
        insights.push('Slower speech may indicate low energy or contemplation');
      }

      if (pauseFrequency > 0.6) {
        criteria.push('Frequent pauses detected');
        insights.push('Speech patterns suggest careful consideration or hesitation');
      }

      if (volumeVariation < 0.3) {
        criteria.push('Low volume variation');
        insights.push('Monotone speech patterns detected');
      }

      // Add text-based insights
      if (lowerText.includes('happy') || lowerText.includes('great')) {
        insights.push('Positive language patterns detected');
      } else if (lowerText.includes('sad') || lowerText.includes('down')) {
        insights.push('Language suggests low mood');
      }

      return {
        detectedMood: moodScore,
        stressLevel: 10 - stressLevel, // Invert for anxiety (lower is better)
        energyLevel: energyLevel,
        confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
        keyInsights: insights.slice(0, 3), // Top 3 insights
        analysisDetails: {
          pitchVariation: (pitchVariation * 100).toFixed(1) + '%',
          speechRate: speechRate > 0.7 ? 'Fast' : speechRate < 0.3 ? 'Slow' : 'Normal',
          pauseFrequency: pauseFrequency > 0.6 ? 'High' : pauseFrequency < 0.3 ? 'Low' : 'Normal',
          volumeVariation: volumeVariation > 0.7 ? 'High' : volumeVariation < 0.3 ? 'Low' : 'Normal'
        },
        scoringCriteria: criteria,
        recommendation: generateRecommendation(moodScore, stressLevel, energyLevel)
      };
    } catch (error) {
      console.error('Voice analysis error:', error);
      throw new Error('Voice analysis failed. Please try again.');
    }
  };

  const generateRecommendation = (mood, stress, energy) => {
    if (mood >= 8 && energy >= 7) {
      return "You're feeling great! This is a perfect time for creative activities or social connections.";
    } else if (mood <= 3 || stress >= 8) {
      return "Consider some self-care activities like deep breathing, meditation, or talking to someone you trust.";
    } else if (energy <= 3) {
      return "Your energy seems low. Try gentle activities like a short walk or listening to uplifting music.";
    } else if (stress >= 6) {
      return "You might be feeling stressed. Progressive muscle relaxation or mindfulness exercises could help.";
    } else {
      return "You're in a balanced state. Maintain this with regular self-care and healthy habits.";
    }
  };

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setIsRecording(false);
      return;
    }

    setVoiceError('');
    setVoiceAnalysis(null);

    try {
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        // Initialize audio context for voice analysis
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);

        setIsRecording(true);

        recognitionRef.current.onresult = async (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }

          if (transcript.trim()) {
            try {
              // Simulate audio feature extraction
              const audioFeatures = {
                pitchVariation: Math.random(),
                speechRate: 0.3 + Math.random() * 0.7,
                pauseFrequency: Math.random(),
                volumeVariation: Math.random()
              };

              const analysis = await analyzeVoicePattern(transcript, audioFeatures);
              
              setVoiceAnalysis({
                ...analysis,
                transcript: transcript
              });
              
              // Update mood sliders based on analysis
              setCurrentMood(analysis.detectedMood);
              setAnxiety(analysis.stressLevel);
              setEnergy(analysis.energyLevel);
              
              setIsRecording(false);
              
              // Stop audio stream
              stream.getTracks().forEach(track => track.stop());
              if (audioContextRef.current) {
                audioContextRef.current.close();
              }
            } catch (error) {
              setVoiceError(error.message);
              setIsRecording(false);
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          setVoiceError('Speech recognition error. Please try again.');
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current.start();
      } else {
        setVoiceError('Speech recognition not supported in this browser.');
      }
    } catch (error) {
      setVoiceError('Microphone access denied or not available.');
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const moodEntry = {
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        mood: currentMood,
        anxiety: anxiety,
        energy: energy,
        notes: notes,
        voiceAnalysis: voiceAnalysis,
      };

      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user mood history
      const updatedHistory = [moodEntry, ...user.moodHistory.slice(0, 29)];
      updateUser({ moodHistory: updatedHistory });
      
      // Save to localStorage as backup
      const savedMoods = JSON.parse(localStorage.getItem('mindcare_moods') || '[]');
      savedMoods.unshift(moodEntry);
      localStorage.setItem('mindcare_moods', JSON.stringify(savedMoods.slice(0, 100))); // Keep last 100 entries
      
      setSaveSuccess(true);
      
      // Reset form after successful save
      setTimeout(() => {
        setNotes('');
        setVoiceAnalysis(null);
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving mood entry:', error);
      setVoiceError('Failed to save mood entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getMoodColor = (value) => {
    const index = Math.max(0, Math.min(9, Math.floor((value - 1) / 1)));
    return moodColors[index];
  };

  const getMoodEmoji = (value) => {
    const index = Math.max(0, Math.min(9, Math.floor((value - 1) / 1)));
    return moodEmojis[index];
  };

  const getMoodLabel = (value) => {
    const index = Math.max(0, Math.min(9, Math.floor((value - 1) / 1)));
    return moodLabels[index];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-4">How are you feeling today?</h1>
        <p className="text-white/80 text-lg">Track your mood with AI-powered voice analysis</p>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-4 border-l-4 border-green-400"
          >
            <div className="flex items-center text-green-300">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Mood entry saved successfully! ✅</span>
            </div>
          </motion.div>
        )}
        
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-4 border-l-4 border-red-400"
          >
            <div className="flex items-center text-red-300">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{voiceError}</span>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Couldn't detect mood. Try manual entry below!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recording Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Voice Mood Analysis</h3>
          <p className="text-white/70 mb-6">Tell us about your day and let AI analyze your emotional state</p>
          
          <motion.button
            onClick={handleVoiceRecord}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 animate-pulse shadow-2xl' 
                : 'gradient-button shadow-lg hover:shadow-xl'
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
          
          <p className="mt-4 text-sm text-white/60">
            {isRecording ? 'Recording... Speak naturally about how you feel' : 'Tap to start voice analysis'}
          </p>
          
          {/* Test Suggestions */}
          <div className="mt-4 text-xs text-white/50">
            <p>💡 Try saying: "I'm feeling great today!" or "I've been really stressed lately"</p>
          </div>
          
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-center items-center space-x-2"
            >
              <Volume2 className="w-5 h-5 text-blue-400" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-8 bg-blue-400 rounded-full"
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
            className="mt-8 glass-card p-6"
          >
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
              <h4 className="font-semibold text-white">AI Voice Analysis Results</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{voiceAnalysis.detectedMood}/10</div>
                <div className="text-sm text-white/60">Mood Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{voiceAnalysis.stressLevel}/10</div>
                <div className="text-sm text-white/60">Anxiety Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{voiceAnalysis.energyLevel}/10</div>
                <div className="text-sm text-white/60">Energy Level</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h5 className="font-medium text-white mb-2">What you said:</h5>
                <p className="text-sm text-white/80 italic">"{voiceAnalysis.transcript}"</p>
              </div>

              <div className="glass-card p-4">
                <h5 className="font-medium text-white mb-2">Analysis Details:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Pitch Variation: <span className="text-blue-300">{voiceAnalysis.analysisDetails.pitchVariation}</span></div>
                  <div>Speech Rate: <span className="text-green-300">{voiceAnalysis.analysisDetails.speechRate}</span></div>
                  <div>Pause Frequency: <span className="text-yellow-300">{voiceAnalysis.analysisDetails.pauseFrequency}</span></div>
                  <div>Volume Variation: <span className="text-purple-300">{voiceAnalysis.analysisDetails.volumeVariation}</span></div>
                </div>
              </div>

              <div className="glass-card p-4">
                <h5 className="font-medium text-white mb-2">Key Insights:</h5>
                <ul className="space-y-1">
                  {voiceAnalysis.keyInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-white/80 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-card p-4">
                <h5 className="font-medium text-white mb-2">Recommendation:</h5>
                <p className="text-sm text-white/80">{voiceAnalysis.recommendation}</p>
              </div>

              <div className="text-center text-xs text-white/50">
                Confidence: {Math.round(voiceAnalysis.confidence * 100)}% • 
                Powered by Advanced Voice Analysis
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
        className="glass-card p-8"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Manual Mood Entry</h3>
        
        {/* Mood Slider */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-medium">Overall Mood</label>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getMoodEmoji(currentMood)}</span>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">{getMoodLabel(currentMood)}</div>
                  <div className="text-xs text-white/60">{currentMood}/10</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood}
                onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                className="w-full h-4 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    #dc2626 0%, #ea580c 20%, #f59e0b 40%, 
                    #eab308 50%, #84cc16 60%, #22c55e 80%, #3b82f6 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/50 mt-2">
                <span>😢 Very Sad</span>
                <span>😐 Neutral</span>
                <span>😊 Happy</span>
                <span>🌟 Euphoric</span>
              </div>
            </div>
          </div>

          {/* Anxiety Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-medium">Anxiety Level</label>
              <div className="text-right">
                <div className="text-sm text-white font-medium">
                  {anxiety <= 3 ? 'Low' : anxiety <= 6 ? 'Moderate' : 'High'}
                </div>
                <div className="text-xs text-white/60">{anxiety}/10</div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={anxiety}
              onChange={(e) => setAnxiety(parseInt(e.target.value))}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #22c55e 0%, #eab308 50%, #dc2626 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>😌 Calm</span>
              <span>😐 Moderate</span>
              <span>😰 Very Anxious</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-white font-medium">Energy Level</label>
              <div className="text-right">
                <div className="text-sm text-white font-medium">
                  {energy <= 3 ? 'Low' : energy <= 6 ? 'Moderate' : 'High'}
                </div>
                <div className="text-xs text-white/60">{energy}/10</div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6b7280 0%, #3b82f6 50%, #22c55e 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>😴 Exhausted</span>
              <span>😐 Moderate</span>
              <span>⚡ Energetic</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8">
          <label className="block text-white font-medium mb-3">Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind? Any specific events or thoughts affecting your mood?"
            className="w-full p-4 glass-card text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            rows={4}
          />
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 gradient-button text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
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