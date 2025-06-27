import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Clock, Shield, Heart, X } from 'lucide-react';

interface CrisisSupportProps {
  onClose: () => void;
}

export default function CrisisSupport({ onClose }: CrisisSupportProps) {
  const emergencyContacts = [
    {
      country: 'India',
      services: [
        { name: 'KIRAN Mental Health', number: '1800-599-0019', available: '24/7', type: 'crisis' },
        { name: 'AASRA Suicide Prevention', number: '91-22-27546669', available: '24/7', type: 'suicide' },
        { name: 'Vandrevala Foundation', number: '1860-2662-345', available: '24/7', type: 'general' },
      ]
    },
    {
      country: 'International',
      services: [
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7', type: 'text' },
        { name: 'International Association', number: 'iasp.info/resources', available: '24/7', type: 'web' },
      ]
    }
  ];

  const cryofCrisistips = [
    'Take slow, deep breaths',
    'Ground yourself: name 5 things you can see',
    'You are not alone in this',
    'This feeling will pass',
    'Reach out to someone you trust',
    'Consider professional help'
  ];

  const handleCall = (number: string) => {
    if (number.includes('http')) {
      window.open(number, '_blank');
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
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-crisis-500 to-warm-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Crisis Support</h2>
                <p className="text-white/90">Immediate help is available</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Immediate Crisis Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-healing-50 to-primary-50 p-6 rounded-xl border border-healing-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">You Are Not Alone</h3>
            <p className="text-gray-700 mb-4">
              If you're having thoughts of self-harm or suicide, please reach out for help immediately. 
              These feelings are treatable, and support is available right now.
            </p>
            <div className="flex items-center text-sm text-healing-700">
              <Shield className="w-4 h-4 mr-2" />
              All calls are confidential and free
            </div>
          </motion.div>

          {/* Emergency Contacts */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Emergency Contacts</h3>
            
            {emergencyContacts.map((region, regionIndex) => (
              <motion.div
                key={region.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: regionIndex * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                  {region.country}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {region.services.map((service, serviceIndex) => (
                    <motion.div
                      key={serviceIndex}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-900">{service.name}</h5>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.available}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.type === 'crisis' ? 'bg-crisis-100 text-crisis-700' :
                          service.type === 'suicide' ? 'bg-warm-100 text-warm-700' :
                          service.type === 'text' ? 'bg-primary-100 text-primary-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {service.type}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCall(service.number)}
                        className="w-full bg-gradient-to-r from-primary-500 to-healing-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                      >
                        {service.type === 'text' ? (
                          <>
                            <MessageCircle className="w-5 h-5 mr-2" />
                            {service.number}
                          </>
                        ) : service.type === 'web' ? (
                          <>
                            <MapPin className="w-5 h-5 mr-2" />
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
            className="bg-gradient-to-r from-healing-50 to-primary-50 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Immediate Coping Strategies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cryofCrisistips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-healing-200"
                >
                  <div className="w-2 h-2 bg-healing-500 rounded-full" />
                  <span className="text-gray-700">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Safety Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Safety Plan</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">1. Warning Signs</h4>
                <p className="text-sm text-gray-600">Identify thoughts, feelings, or situations that might lead to crisis</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">2. Support Network</h4>
                <p className="text-sm text-gray-600">List trusted friends, family, or professionals you can contact</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">3. Coping Strategies</h4>
                <p className="text-sm text-gray-600">Activities that help you feel better and stay safe</p>
              </div>
            </div>
            
            <button className="mt-4 w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Download Safety Plan Template
            </button>
          </motion.div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
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