import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Menu, X, Shield, AlertTriangle, Mic, Globe, User, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onCrisisAlert: () => void;
  onVoiceToggle: () => void;
}

export default function Header({ currentView, onNavigate, onCrisisAlert, onVoiceToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();
  const { currentLanguage, supportedLanguages, changeLanguage, translate } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { id: 'dashboard', label: translate('dashboard.title', 'Dashboard'), icon: '🏠' },
    { id: 'mood', label: translate('mood.title', 'Mood Tracker'), icon: '😊' },
    { id: 'art', label: translate('art.title', 'Art Therapy'), icon: '🎨' },
    { id: 'chat', label: translate('chat.title', 'TicTac Chat'), icon: '💬' },
    { id: 'companion', label: translate('companion.title', 'AI Companion'), icon: '🤖' },
    { id: 'profile', label: translate('profile.title', 'Profile'), icon: '👤' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'glass-header backdrop-blur-30 shadow-lg py-2' 
        : 'glass-header backdrop-blur-20 py-4'
    }`}>
      {/* Bolt Badge - Top Right Corner */}
      <motion.a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-4 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Powered by Bolt"
      >
        <div className="w-12 h-12 glass-card flex items-center justify-center hover:shadow-lg transition-all duration-300">
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </motion.a>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="gradient-button p-2 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                {translate('app.title', 'MindCare')}
              </h1>
              <p className="text-xs text-white/70">{translate('app.subtitle', 'AI Mental Health Assistant')}</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentView === item.id
                    ? 'glass-button text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4 pr-16">
            {/* Voice Assistant Button */}
            <motion.button
              onClick={onVoiceToggle}
              className="glass-button p-2 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              title="Voice Assistant"
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 glass-button p-2 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Globe className="w-5 h-5" />
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden sm:block text-sm">{currentLanguage.code.toUpperCase()}</span>
              </motion.button>

              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 glass-card max-h-96 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    {supportedLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          changeLanguage(language.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-white/10 transition-colors ${
                          currentLanguage.code === language.code ? 'bg-white/20 text-white' : 'text-white/80'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex-1">
                          <div className="font-medium">{language.name}</div>
                          <div className="text-sm opacity-70">{language.nativeName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Crisis Alert Button */}
            <motion.button
              onClick={onCrisisAlert}
              className="glass-button p-2 text-red-300 rounded-lg transition-colors hover:text-red-200"
              whileHover={{ scale: 1.1 }}
              title={translate('crisis.support', 'Crisis Support')}
            >
              <AlertTriangle className="w-5 h-5" />
            </motion.button>

            {/* Subscription Tier */}
            <button
              onClick={() => onNavigate('subscription')}
              className={`px-3 py-1 rounded-full text-xs font-semibold glass-button ${
                user.profile.tier === 'premium'
                  ? 'text-orange-300'
                  : user.profile.tier === 'professional'
                  ? 'text-blue-300'
                  : 'text-white/80'
              }`}
            >
              {user.profile.tier.toUpperCase()}
            </button>

            {/* User Avatar */}
            <motion.button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user.profile.avatar}
                alt={user.profile.name}
                className="w-8 h-8 rounded-full border-2 border-white/30"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.profile.name}</p>
                <p className="text-xs text-white/60">ID: {user.profile.id.slice(-6)}</p>
              </div>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass-button p-2 text-white rounded-lg"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 py-4"
          >
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    currentView === item.id
                      ? 'glass-button text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              {/* Mobile Bolt Badge */}
              <motion.a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 mx-4 bg-black/50 text-white rounded-lg text-sm font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/black_circle_360x360.png"
                  alt="Powered by Bolt"
                  className="w-6 h-6"
                />
                <span>Powered by Bolt</span>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}