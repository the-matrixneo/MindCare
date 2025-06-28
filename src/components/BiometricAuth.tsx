import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, Shield, Eye, Volume2, Lock, Unlock } from 'lucide-react';

interface BiometricAuthProps {
  onAuth: (success: boolean) => void;
}

export default function BiometricAuth({ onAuth }: BiometricAuthProps) {
  const [authMethod, setAuthMethod] = useState<'face' | 'voice' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFaceAuth = async () => {
    setAuthMethod('face');
    setIsScanning(true);
    setProgress(0);

    // Simulate face scanning
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsAuthenticated(true);
          setTimeout(() => onAuth(true), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Get video stream for demo
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log('Camera access denied - using demo mode');
    }
  };

  const handleVoiceAuth = async () => {
    setAuthMethod('voice');
    setIsScanning(true);
    setProgress(0);

    // Simulate voice analysis
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setIsAuthenticated(true);
          setTimeout(() => onAuth(true), 1000);
          return 100;
        }
        return prev + 8;
      });
    }, 250);
  };

  const features = [
    'AI-powered mental health analysis',
    'Secure biometric authentication',
    'End-to-end encrypted conversations',
    'Crisis intervention protocols',
    'Personalized therapeutic content'
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Animated background particles */}
      <div className="bg-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Bolt Badge - Top Right Corner */}
      <motion.a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Powered by Bolt"
      >
        <div className="w-16 h-16 glass-card flex items-center justify-center hover:shadow-xl transition-all duration-300">
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt"
            className="w-12 h-12 rounded-full"
          />
        </div>
      </motion.a>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side - App Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="w-16 h-16 gradient-button rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  MindCare
                </h1>
                <p className="text-white/70">AI Mental Health Assistant</p>
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Your Mental Health Companion
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Secure, AI-powered mental health support with advanced biometric protection.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/80">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center mb-3">
              <Lock className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="font-semibold text-white">Privacy First</h3>
            </div>
            <p className="text-white/70 text-sm">
              Your biometric data is processed locally and never stored on our servers. 
              All conversations are encrypted end-to-end for maximum privacy.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Authentication */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Secure Authentication</h3>
            <p className="text-white/70">Choose your preferred biometric method</p>
          </div>

          {!authMethod && (
            <div className="space-y-4">
              <motion.button
                onClick={handleFaceAuth}
                className="w-full glass-button text-white p-6 rounded-2xl hover:shadow-lg transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 mr-3" />
                  <Eye className="w-6 h-6" />
                </div>
                <div className="text-lg font-semibold mb-2">Face Recognition</div>
                <div className="text-sm opacity-90">Secure facial biometric authentication</div>
              </motion.button>

              <motion.button
                onClick={handleVoiceAuth}
                className="w-full glass-button text-white p-6 rounded-2xl hover:shadow-lg transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center mb-3">
                  <Mic className="w-8 h-8 mr-3" />
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="text-lg font-semibold mb-2">Voice Recognition</div>
                <div className="text-sm opacity-90">Secure voice biometric authentication</div>
              </motion.button>

              <div className="text-center mt-6">
                <button
                  onClick={() => onAuth(true)}
                  className="text-white/60 hover:text-white/80 text-sm underline"
                >
                  Skip authentication (Demo Mode)
                </button>
              </div>
            </div>
          )}

          {authMethod === 'face' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gray-900 rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                </div>
                
                {isScanning && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 border-4 border-blue-400 rounded-2xl"
                  />
                )}

                {isAuthenticated && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Unlock className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-lg font-semibold text-white mb-2">
                  {isAuthenticated ? 'Authentication Successful!' : 
                   isScanning ? 'Scanning Face...' : 'Position Your Face'}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-sm text-white/70 mt-2">{progress}% Complete</div>
              </div>
            </motion.div>
          )}

          {authMethod === 'voice' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Mic className="w-16 h-16 text-white" />
                  </motion.div>
                </div>

                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-16 bg-white rounded-full mx-1"
                        animate={{
                          scaleY: [1, 2, 1],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}

                {isAuthenticated && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Unlock className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-lg font-semibold text-white mb-2">
                  {isAuthenticated ? 'Voice Verified!' : 
                   isScanning ? 'Analyzing Voice Pattern...' : 'Speak Naturally'}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-sm text-white/70 mt-2">{progress}% Complete</div>
              </div>

              {isScanning && (
                <p className="text-sm text-white/70">
                  "Please say: I am accessing my mental health assistant"
                </p>
              )}
            </motion.div>
          )}

          {authMethod && !isAuthenticated && (
            <button
              onClick={() => {
                setAuthMethod(null);
                setIsScanning(false);
                setProgress(0);
              }}
              className="w-full mt-4 py-3 glass-button text-white rounded-lg hover:bg-white/20"
            >
              Try Different Method
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}