import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Shield, Heart, X, AlertTriangle, Users, Globe } from 'lucide-react';

interface CrisisSupportProps {
  onClose: () => void;
}

export default function CrisisSupport({ onClose }: CrisisSupportProps) {
  const emergencyContacts = [
    {
      country: 'India',
      flag: '🇮🇳',
      services: [
        { name: 'KIRAN Mental Health', number: '1800-599-0019', available: '24/7', type: 'crisis' },
        { name: 'AASRA Suicide Prevention', number: '91-22-27546669', available: '24/7', type: 'suicide' },
        { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7', type: 'general' },
      ]
    },
    {
      country: 'United States',
      flag: '🇺🇸',
      services: [
        { name: 'Crisis Lifeline', number: '988', available: '24/7', type: 'crisis' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7', type: 'text' },
      ]
    },
    {
      country: 'International',
      flag: '🌍',
      services: [
        { name: 'Find A Helpline', number: 'findahelpline.com', available: '24/7', type: 'web' },
        { name: 'International Association', number: 'iasp.info/resources', available: '24/7', type: 'web' },
      ]
    }
  ];

  const copingTips = [
    'Take slow, deep breaths',
    'Ground yourself: name 5 things you can see',
    'You are not alone in this',
    'This feeling will pass',
    'Reach out to someone you trust',
    'Consider professional help'
  ];

  const handleCall = (number: string) => {
    if (number.includes('http') || number.includes('.com')) {
      window.open(`https://${number}`, '_blank');
    } else {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="glass-header p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">Crisis Support</h2>
                <p className="text-white/80">Immediate help is available</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="glass-button p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Immediate Crisis Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-l-4 border-red-400"
          >
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">You Are Not Alone</h3>
            </div>
            <p className="text-white/80 mb-4">
              If you're having thoughts of self-harm or suicide, please reach out for help immediately. 
              These feelings are treatable, and support is available right now.
            </p>
            <div className="flex items-center text-sm text-green-300">
              <Shield className="w-4 h-4 mr-2" />
              All calls are confidential and free
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-400" />
              Emergency Contacts
            </h3>
            
            {emergencyContacts.map((region, regionIndex) => (
              <motion.div
                key={region.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: regionIndex * 0.1 }}
                className="glass-card p-6"
              >
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">{region.flag}</span>
                  {region.country}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {region.services.map((service, serviceIndex) => (
                    <motion.div
                      key={serviceIndex}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-white">{service.name}</h5>
                          <div className="flex items-center text-sm text-white/70 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.available}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.type === 'crisis' ? 'bg-red-500/20 text-red-300' :
                          service.type === 'suicide' ? 'bg-orange-500/20 text-orange-300' :
                          service.type === 'text' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {service.type}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCall(service.number)}
                        className="w-full gradient-button text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                      >
                        {service.type === 'text' ? (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            {service.number}
                          </>
                        ) : service.type === 'web' ? (
                          <>
                            <Globe className="w-5 h-5 mr-2" />
                            Visit Website
                          </>
                        ) : (
                          <>
                            <Phone className="w-5 h-5 mr-2" />
                            {service.number}
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coping Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-green-400" />
              Immediate Coping Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {copingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 glass-card rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/80">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Safety Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-400" />
              Create Your Safety Plan
            </h3>
            <div className="space-y-4">
              <div className="p-4 glass-card rounded-lg">
                <h4 className="font-medium text-white mb-2">1. Warning Signs</h4>
                <p className="text-sm text-white/70">Identify thoughts, feelings, or situations that might lead to crisis</p>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <h4 className="font-medium text-white mb-2">2. Support Network</h4>
                <p className="text-sm text-white/70">List trusted friends, family, or professionals you can contact</p>
              </div>
              <div className="p-4 glass-card rounded-lg">
                <h4 className="font-medium text-white mb-2">3. Coping Strategies</h4>
                <p className="text-sm text-white/70">Activities that help you feel better and stay safe</p>
              </div>
            </div>
            
            <button className="mt-4 w-full gradient-button text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Download Safety Plan Template
            </button>
          </motion.div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-white/60 border-t border-white/20 pt-6">
            <p>
              This app provides support resources but is not a substitute for professional mental health care. 
              If you're in immediate danger, call emergency services (911, 112) or go to your nearest emergency room.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}