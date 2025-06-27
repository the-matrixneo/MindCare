import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Zap, Shield, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function Subscription() {
  const { user, updateUser } = useUser();
  const [selectedPlan, setSelectedPlan] = useState(user.profile.tier);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Essential mental health support',
      icon: Shield,
      color: 'from-gray-400 to-gray-500',
      features: [
        'Basic mood tracking',
        '1 art therapy session/day',
        '30 minutes TicTac chat/day',
        'Basic AI insights',
        'Crisis support access',
        'Community resources'
      ],
      limitations: [
        'Limited art generation',
        'Basic analytics only',
        'No priority support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Enhanced mental wellness journey',
      icon: Star,
      color: 'from-primary-500 to-healing-500',
      popular: true,
      features: [
        'Advanced mood analytics',
        'Unlimited art therapy',
        'Unlimited TicTac sessions',
        'Advanced AI insights',
        'Priority crisis support',
        'Personalized recommendations',
        'Progress tracking',
        'Export data',
        'Premium support'
      ],
      limitations: []
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'For mental health professionals',
      icon: Crown,
      color: 'from-warm-500 to-primary-600',
      features: [
        'Everything in Premium',
        'Client management tools',
        'Professional insights',
        'HIPAA compliance',
        'Advanced analytics',
        'White-label options',
        'API access',
        'Dedicated support',
        'Training resources'
      ],
      limitations: []
    }
  ];

  const payPerUse = {
    name: 'Professional Session',
    price: 29.99,
    description: 'One-time professional consultation',
    features: [
      '1-hour licensed therapist session',
      'Comprehensive assessment',
      'Personalized treatment plan',
      'Follow-up resources',
      'Session recording (optional)'
    ]
  };

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPayment(true);
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      updateUser({
        profile: { ...user.profile, tier: selectedPlan },
        subscription: {
          tier: selectedPlan,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true,
        },
        limits: selectedPlan === 'premium' || selectedPlan === 'professional' 
          ? { artTherapy: -1, tictacMinutes: -1, aiAnalyses: -1 }
          : user.limits
      });
      setShowPayment(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 mb-8">Invest in your mental health journey</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
          <span className={`font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="bg-healing-100 text-healing-700 px-3 py-1 rounded-full text-sm font-medium">
              Save 17%
            </span>
          )}
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl border-2 shadow-lg overflow-hidden ${
              plan.popular ? 'border-primary-500 shadow-primary-100' : 'border-gray-200'
            } ${user.profile.tier === plan.id ? 'ring-2 ring-healing-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-500 to-healing-500 text-white text-center py-2 text-sm font-semibold">
                Most Popular
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mr-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${(plan.price.yearly / 12).toFixed(2)}/month billed annually
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-healing-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation, limitIndex) => (
                  <li key={limitIndex} className="flex items-center text-gray-400">
                    <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    {limitation}
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  user.profile.tier === plan.id
                    ? 'bg-healing-100 text-healing-700 cursor-default'
                    : plan.id === 'free'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg`
                }`}
                whileHover={user.profile.tier !== plan.id ? { scale: 1.02 } : {}}
                whileTap={user.profile.tier !== plan.id ? { scale: 0.98 } : {}}
                disabled={user.profile.tier === plan.id}
              >
                {user.profile.tier === plan.id ? 'Current Plan' : 
                 plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pay-Per-Use Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-warm-50 to-primary-50 rounded-2xl p-8 border border-warm-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-warm-500 to-primary-500 rounded-xl flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{payPerUse.name}</h3>
                <p className="text-gray-600">{payPerUse.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">${payPerUse.price}</div>
                <ul className="space-y-2">
                  {payPerUse.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-4 h-4 text-healing-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center">
                <button className="w-full bg-gradient-to-r from-warm-500 to-primary-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Book Session Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current Usage Stats */}
      {user.profile.tier !== 'premium' && user.profile.tier !== 'professional' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Current Usage</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {user.usage.artTherapyToday}/{user.limits.artTherapy}
              </div>
              <div className="text-gray-600">Art Therapy Sessions</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${(user.usage.artTherapyToday / user.limits.artTherapy) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-healing-600 mb-2">
                {user.usage.tictacMinutesToday}/{user.limits.tictacMinutes}
              </div>
              <div className="text-gray-600">TicTac Minutes</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-healing-500 h-2 rounded-full"
                  style={{ width: `${(user.usage.tictacMinutesToday / user.limits.tictacMinutes) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-warm-600 mb-2">
                {user.usage.aiAnalysesToday}/{user.limits.aiAnalyses}
              </div>
              <div className="text-gray-600">AI Analyses</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-warm-500 h-2 rounded-full"
                  style={{ width: `${(user.usage.aiAnalysesToday / user.limits.aiAnalyses) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPayment(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Upgrade</h3>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {plans.find(p => p.id === selectedPlan)?.name} Plan
                </span>
                <span className="font-bold">
                  ${plans.find(p => p.id === selectedPlan)?.price[billingCycle]}
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-healing-500 text-white rounded-lg font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}