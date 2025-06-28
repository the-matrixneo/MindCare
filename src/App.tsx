import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import ArtTherapy from './components/ArtTherapy';
import TicTacChat from './components/TicTacChat';
import CrisisSupport from './components/CrisisSupport';
import Subscription from './components/Subscription';
import BiometricAuth from './components/BiometricAuth';
import AICompanion from './components/AICompanion';
import UserProfile from './components/UserProfile';
import VoiceAssistant from './components/VoiceAssistant';
import { UserProvider } from './contexts/UserContext';
import { AIProvider } from './contexts/AIContext';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  // Simulate crisis detection
  useEffect(() => {
    const checkCrisisKeywords = () => {
      // In real app, this would monitor user input across components
      const riskKeywords = ['hopeless', 'end it all', 'not worth living'];
      // Simulated risk detection for demo
    };
    
    checkCrisisKeywords();
  }, []);

  const handleAuthentication = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleCrisisAlert = () => {
    setShowCrisis(true);
  };

  if (!isAuthenticated) {
    return <BiometricAuth onAuth={handleAuthentication} />;
  }

  return (
    <LanguageProvider>
      <AIProvider>
        <UserProvider>
          <div className="min-h-screen relative">
            {/* Animated background particles */}
            <div className="bg-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>

            <Header 
              currentView={currentView} 
              onNavigate={setCurrentView}
              onCrisisAlert={handleCrisisAlert}
              onVoiceToggle={() => setShowVoiceAssistant(!showVoiceAssistant)}
            />
            
            <main className="container mx-auto px-4 py-6 max-w-7xl relative z-10" style={{ paddingTop: '120px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
                  {currentView === 'mood' && <MoodTracker />}
                  {currentView === 'art' && <ArtTherapy />}
                  {currentView === 'chat' && <TicTacChat />}
                  {currentView === 'companion' && <AICompanion />}
                  {currentView === 'profile' && <UserProfile />}
                  {currentView === 'subscription' && <Subscription />}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Voice Assistant */}
            <AnimatePresence>
              {showVoiceAssistant && (
                <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
              )}
            </AnimatePresence>

            {/* Crisis Support Modal */}
            <AnimatePresence>
              {showCrisis && (
                <CrisisSupport onClose={() => setShowCrisis(false)} />
              )}
            </AnimatePresence>

            {/* Emergency FAB */}
            <motion.button
              className="fixed bottom-6 right-6 gradient-button text-white p-4 rounded-full z-50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCrisisAlert}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>

            {/* Voice Assistant FAB */}
            <motion.button
              className="fixed bottom-6 left-6 primary-gradient text-white p-4 rounded-full z-50 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.button>
          </div>
        </UserProvider>
      </AIProvider>
    </LanguageProvider>
  );
}

export default App;