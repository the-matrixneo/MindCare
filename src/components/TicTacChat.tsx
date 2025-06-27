import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Shield, Clock, Lock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function TicTacChat() {
  const { user, checkUsageLimit, trackUsage } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'AI Moderator',
      content: 'Welcome to TicTac secure chat. This conversation is monitored by AI for safety. A mental health professional will join shortly.',
      timestamp: new Date(Date.now() - 60000),
      type: 'system'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const intervalRef = useRef(null);

  const usageLimit = checkUsageLimit('tictacMinutes');

  useEffect(() => {
    if (isConnected) {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConnect = async () => {
    if (!usageLimit.allowed) {
      setShowUpgrade(true);
      return;
    }

    setIsConnecting(true);
    
    // Simulate WebRTC connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      
      // Simulate getting local video stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null; // In real app, this would be getUserMedia stream
      }
      
      // Add system message
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'System',
        content: 'Connected to professional counselor. This session is secure and confidential.',
        timestamp: new Date(),
        type: 'system'
      }]);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCallDuration(0);
    trackUsage('tictacMinutes', Math.ceil(callDuration / 60));
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'System',
      content: `Session ended. Duration: ${formatDuration(callDuration)}. Take care of yourself.`,
      timestamp: new Date(),
      type: 'system'
    }]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate AI moderation and response
    setTimeout(() => {
      const responses = [
        "I understand how you're feeling. Can you tell me more about what's been troubling you?",
        "That sounds really challenging. You're brave for reaching out for support.",
        "Thank you for sharing that with me. How long have you been experiencing these feelings?",
        "I hear you. Let's work through this together. What coping strategies have you tried before?",
      ];

      const response = {
        id: Date.now(),
        sender: 'Dr. Sarah (Licensed Therapist)',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'professional'
      };

      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">TicTac Secure Chat</h1>
            <p className="text-gray-600">Connect with licensed mental health professionals</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              End-to-End Encrypted
            </div>
            
            {usageLimit.remaining !== -1 && (
              <div className={`px-3 py-1 rounded-full text-sm ${
                usageLimit.allowed ? 'bg-healing-100 text-healing-700' : 'bg-warm-100 text-warm-700'
              }`}>
                {usageLimit.remaining} min remaining
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Chat Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Video Area */}
          <div className="relative bg-gray-900 aspect-video">
            {/* Remote Video */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-healing-500/20" />
                
                {/* Simulated professional */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">👩‍⚕️</span>
                    </div>
                    <p className="text-lg font-semibold">Dr. Sarah Martinez</p>
                    <p className="text-sm opacity-80">Licensed Clinical Psychologist</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Local Video (Picture-in-Picture) */}
            {isConnected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
              >
                <video
                  ref={localVideoRef}
                  muted
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="w-8 h-8 text-white" />
                  </div>
                )}
              </motion.div>
            )}

            {/* Connection States */}
            {!isConnected && !isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Video className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Connect</h3>
                  <p className="text-white/80 mb-6">Click connect to start your secure session</p>
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
                  />
                  <p className="text-lg">Connecting to professional...</p>
                  <p className="text-sm text-white/70 mt-2">Establishing secure connection</p>
                </div>
              </div>
            )}

            {/* Call Duration */}
            {isConnected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center"
              >
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(callDuration)}
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-gray-50 flex items-center justify-center space-x-4">
            {isConnected ? (
              <>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-3 rounded-full transition-colors ${
                    videoEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                  }`}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-3 rounded-full transition-colors ${
                    audioEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-500 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </>
            ) : (
              <motion.button
                onClick={handleConnect}
                disabled={isConnecting || !usageLimit.allowed}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  isConnecting || !usageLimit.allowed
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-healing-500 text-white hover:shadow-lg'
                }`}
                whileHover={!isConnecting && usageLimit.allowed ? { scale: 1.05 } : {}}
                whileTap={!isConnecting && usageLimit.allowed ? { scale: 0.95 } : {}}
              >
                {!usageLimit.allowed ? (
                  <span className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Upgrade for More Time
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    {isConnecting ? 'Connecting...' : 'Connect Now'}
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-96"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Secure Chat</h3>
            <p className="text-xs text-gray-500 mt-1">AI-moderated for safety</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${
                    message.type === 'system'
                      ? 'text-center'
                      : message.type === 'user'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <div className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
                    message.type === 'system'
                      ? 'bg-gray-100 text-gray-600'
                      : message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-healing-100 text-healing-800'
                  }`}>
                    {message.type !== 'system' && (
                      <div className="font-medium text-xs mb-1 opacity-75">
                        {message.sender}
                      </div>
                    )}
                    <p>{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Emergency Contact Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-crisis-500 to-warm-500 text-white rounded-2xl p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Crisis Support Available 24/7</h3>
            <p className="text-sm opacity-90">If you're in immediate danger, don't wait - get help now</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Call KIRAN: 1800-599-0019
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Emergency: 112
            </button>
          </div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Extend Your Session</h3>
              <p className="text-gray-600 mb-6">
                You've used your daily {user.limits.tictacMinutes} minutes. Upgrade to Premium for unlimited video sessions 
                with licensed professionals.
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