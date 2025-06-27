import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Brain, Palette, MessageCircle, Shield, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useUser } from '../contexts/UserContext';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, checkUsageLimit } = useUser();

  const quickActions = [
    {
      id: 'mood',
      title: 'Track Mood',
      description: 'Log your current emotional state',
      icon: Brain,
      color: 'from-primary-500 to-primary-600',
      action: () => onNavigate('mood'),
    },
    {
      id: 'art',
      title: 'Art Therapy',
      description: 'Create therapeutic art',
      icon: Palette,
      color: 'from-healing-500 to-healing-600',
      action: () => onNavigate('art'),
      usage: checkUsageLimit('artTherapy'),
    },
    {
      id: 'chat',
      title: 'TicTac Chat',
      description: 'Connect with support',
      icon: MessageCircle,
      color: 'from-warm-500 to-warm-600',
      action: () => onNavigate('chat'),
      usage: checkUsageLimit('tictacMinutes'),
    },
  ];

  const moodChartData = user.moodHistory.slice(0, 7).reverse().map((entry, index) => ({
    day: new Date(entry.date).toLocaleDateString('en', { weekday: 'short' }),
    mood: entry.mood,
    anxiety: 10 - entry.anxiety, // Invert for better visualization
    energy: entry.energy,
  }));

  const aiInsights = [
    {
      type: 'positive',
      title: 'Mood Improvement Detected',
      description: 'Your mood has improved by 23% over the past week. Keep up the great work!',
      confidence: 92,
    },
    {
      type: 'suggestion',
      title: 'Art Therapy Recommendation',
      description: 'Based on your stress patterns, watercolor painting might be particularly beneficial.',
      confidence: 87,
    },
    {
      type: 'alert',
      title: 'Sleep Pattern Notice',
      description: 'Your voice analysis suggests irregular sleep. Consider establishing a bedtime routine.',
      confidence: 78,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-primary-600 to-healing-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user.profile.name}
            </h1>
            <p className="text-primary-100 text-lg">
              How are you feeling today? Let's check in with your mental wellness.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl opacity-80"
          >
            🌟
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer"
              onClick={action.action}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 mb-4">{action.description}</p>
              
              {action.usage && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {action.usage.remaining === -1 
                      ? 'Unlimited' 
                      : `${action.usage.remaining} remaining`}
                  </span>
                  {!action.usage.allowed && (
                    <span className="text-warm-600 font-medium">Upgrade for more</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mood Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Weekly Mood Trends</h3>
            <TrendingUp className="w-5 h-5 text-healing-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodChartData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Today's Wellness Score</h3>
            <Activity className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${7.8 * 2 * Math.PI}`}
                  strokeDashoffset={`${7.8 * 2 * Math.PI * (1 - 0.78)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">78</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mood</span>
              <span className="font-semibold text-primary-600">Good</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stress Level</span>
              <span className="font-semibold text-warm-600">Moderate</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Energy</span>
              <span className="font-semibold text-healing-600">High</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* AI Insights */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">AI-Powered Insights</h2>
          <span className="text-sm text-gray-500 flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Powered by Gemma 3
          </span>
        </div>
        
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-6 rounded-2xl border-l-4 ${
                insight.type === 'positive'
                  ? 'bg-healing-50 border-healing-500'
                  : insight.type === 'alert'
                  ? 'bg-warm-50 border-warm-500'
                  : 'bg-primary-50 border-primary-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Brain className="w-4 h-4 mr-1" />
                    Confidence: {insight.confidence}%
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  insight.type === 'positive'
                    ? 'bg-healing-500'
                    : insight.type === 'alert'
                    ? 'bg-warm-500'
                    : 'bg-primary-500'
                } animate-pulse`} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}