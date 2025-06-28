import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit3, Save, X, Camera, Globe, Shield, Bell, Palette, Heart, Download, Trash2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function UserProfile() {
  const { user, updateUser } = useUser();
  const { currentLanguage, supportedLanguages, changeLanguage, translate } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user.profile);
  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = () => {
    updateUser({ profile: editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(user.profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'personal', label: translate('profile.personal', 'Personal Info'), icon: User },
    { id: 'preferences', label: translate('profile.preferences', 'Preferences'), icon: Palette },
    { id: 'privacy', label: translate('profile.privacy', 'Privacy & Security'), icon: Shield },
    { id: 'notifications', label: translate('profile.notifications', 'Notifications'), icon: Bell },
  ];

  const mentalHealthGoals = [
    'Reduce anxiety',
    'Improve mood',
    'Better sleep',
    'Stress management',
    'Emotional regulation',
    'Self-awareness',
    'Mindfulness practice',
    'Social connection'
  ];

  const therapyPreferences = [
    'Cognitive Behavioral Therapy (CBT)',
    'Mindfulness-Based Therapy',
    'Art Therapy',
    'Music Therapy',
    'Talk Therapy',
    'Group Therapy',
    'EMDR',
    'Dialectical Behavior Therapy (DBT)'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={isEditing ? editedProfile.avatar : user.profile.avatar}
                alt={user.profile.name}
                className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 glass-button text-white p-2 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 gradient-text">{user.profile.name}</h1>
              <p className="text-white/80 text-lg">
                {translate('profile.member_since', 'Member since')} {new Date(user.profile.joinDate || Date.now()).toLocaleDateString()}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold glass-card ${
                  user.profile.tier === 'premium'
                    ? 'text-orange-300'
                    : user.profile.tier === 'professional'
                    ? 'text-blue-300'
                    : 'text-white/80'
                }`}>
                  {user.profile.tier.toUpperCase()}
                </span>
                <span className="text-white/80 text-sm">
                  {currentLanguage.flag} {currentLanguage.nativeName}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/20 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  {translate('profile.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 gradient-button text-white rounded-lg hover:shadow-lg transition-all flex items-center font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {translate('profile.save', 'Save Changes')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 glass-button text-white rounded-lg hover:bg-white/20 transition-colors flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {translate('profile.edit', 'Edit Profile')}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="glass-card overflow-hidden">
        <div className="border-b border-white/20">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-300'
                    : 'border-transparent text-white/60 hover:text-white/80'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {translate('profile.full_name', 'Full Name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/80">{user.profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {translate('profile.email', 'Email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/80">{user.profile.email || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {translate('profile.age', 'Age')}
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="13"
                      max="120"
                      value={editedProfile.age || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white/80">{user.profile.age || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {translate('profile.location', 'Location')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.location || ''}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-white/80">{user.profile.location || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {translate('profile.bio', 'About Me')}
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio || ''}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 glass-card text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                    placeholder="Tell us about yourself and your mental health journey..."
                  />
                ) : (
                  <p className="text-white/80">{user.profile.bio || 'No bio provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  {translate('profile.mental_health_goals', 'Mental Health Goals')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mentalHealthGoals.map((goal) => (
                    <label key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editedProfile.mentalHealthGoals?.includes(goal) || false}
                        onChange={(e) => {
                          if (isEditing) {
                            const goals = editedProfile.mentalHealthGoals || [];
                            if (e.target.checked) {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                mentalHealthGoals: [...goals, goal] 
                              }));
                            } else {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                mentalHealthGoals: goals.filter(g => g !== goal) 
                              }));
                            }
                          }
                        }}
                        disabled={!isEditing}
                        className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                      />
                      <span className="text-sm text-white/80">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {translate('profile.language', 'Preferred Language')}
                  </label>
                  <select
                    value={currentLanguage.code}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="w-full px-3 py-2 glass-card text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-gray-800">
                        {lang.flag} {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    {translate('profile.timezone', 'Timezone')}
                  </label>
                  {isEditing ? (
                    <select
                      value={editedProfile.timezone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 glass-card text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      <option value="Asia/Kolkata" className="bg-gray-800">Asia/Kolkata (IST)</option>
                      <option value="America/New_York" className="bg-gray-800">America/New_York (EST)</option>
                      <option value="Europe/London" className="bg-gray-800">Europe/London (GMT)</option>
                      <option value="Asia/Tokyo" className="bg-gray-800">Asia/Tokyo (JST)</option>
                      <option value="Australia/Sydney" className="bg-gray-800">Australia/Sydney (AEST)</option>
                    </select>
                  ) : (
                    <p className="text-white/80">{user.profile.timezone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  {translate('profile.therapy_preferences', 'Therapy Preferences')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {therapyPreferences.map((therapy) => (
                    <label key={therapy} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editedProfile.therapyPreferences?.includes(therapy) || false}
                        onChange={(e) => {
                          if (isEditing) {
                            const prefs = editedProfile.therapyPreferences || [];
                            if (e.target.checked) {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                therapyPreferences: [...prefs, therapy] 
                              }));
                            } else {
                              setEditedProfile(prev => ({ 
                                ...prev, 
                                therapyPreferences: prefs.filter(p => p !== therapy) 
                              }));
                            }
                          }
                        }}
                        disabled={!isEditing}
                        className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                      />
                      <span className="text-sm text-white/80">{therapy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 border border-blue-400/30">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">
                    {translate('profile.privacy_settings', 'Privacy Settings')}
                  </h3>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-white/80">
                      {translate('profile.data_sharing', 'Allow anonymous data sharing for research')}
                    </span>
                    <input
                      type="checkbox"
                      checked={editedProfile.allowDataSharing || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ ...prev, allowDataSharing: e.target.checked }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-white/80">
                      {translate('profile.analytics', 'Allow usage analytics')}
                    </span>
                    <input
                      type="checkbox"
                      checked={editedProfile.allowAnalytics || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ ...prev, allowAnalytics: e.target.checked }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-white/80">
                      {translate('profile.biometric_data', 'Store biometric templates locally')}
                    </span>
                    <input
                      type="checkbox"
                      checked={editedProfile.storeBiometricData || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ ...prev, storeBiometricData: e.target.checked }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Download className="w-5 h-5 mr-2 text-green-400" />
                    {translate('profile.data_export', 'Data Export')}
                  </h4>
                  <p className="text-white/70 text-sm mb-4">
                    {translate('profile.data_export_desc', 'Download all your data in a portable format')}
                  </p>
                  <button className="w-full gradient-button text-white py-2 rounded-lg hover:shadow-lg transition-all">
                    {translate('profile.download_data', 'Download My Data')}
                  </button>
                </div>

                <div className="glass-card p-6">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Trash2 className="w-5 h-5 mr-2 text-red-400" />
                    {translate('profile.account_deletion', 'Account Deletion')}
                  </h4>
                  <p className="text-white/70 text-sm mb-4">
                    {translate('profile.account_deletion_desc', 'Permanently delete your account and all associated data')}
                  </p>
                  <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                    {translate('profile.delete_account', 'Delete Account')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {translate('profile.notification_preferences', 'Notification Preferences')}
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <span className="font-medium text-white">
                        {translate('profile.mood_reminders', 'Daily mood check-in reminders')}
                      </span>
                      <p className="text-sm text-white/70">
                        {translate('profile.mood_reminders_desc', 'Get reminded to log your daily mood')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications?.moodReminders || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ 
                            ...prev, 
                            notifications: { 
                              ...prev.notifications, 
                              moodReminders: e.target.checked 
                            } 
                          }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <span className="font-medium text-white">
                        {translate('profile.therapy_reminders', 'Therapy session reminders')}
                      </span>
                      <p className="text-sm text-white/70">
                        {translate('profile.therapy_reminders_desc', 'Get notified about upcoming therapy sessions')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications?.therapyReminders || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ 
                            ...prev, 
                            notifications: { 
                              ...prev.notifications, 
                              therapyReminders: e.target.checked 
                            } 
                          }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <span className="font-medium text-white">
                        {translate('profile.crisis_alerts', 'Crisis support alerts')}
                      </span>
                      <p className="text-sm text-white/70">
                        {translate('profile.crisis_alerts_desc', 'Immediate notifications for crisis support resources')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications?.crisisAlerts !== false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ 
                            ...prev, 
                            notifications: { 
                              ...prev.notifications, 
                              crisisAlerts: e.target.checked 
                            } 
                          }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div>
                      <span className="font-medium text-white">
                        {translate('profile.progress_updates', 'Progress updates')}
                      </span>
                      <p className="text-sm text-white/70">
                        {translate('profile.progress_updates_desc', 'Weekly summaries of your mental health progress')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications?.progressUpdates || false}
                      onChange={(e) => {
                        if (isEditing) {
                          setEditedProfile(prev => ({ 
                            ...prev, 
                            notifications: { 
                              ...prev.notifications, 
                              progressUpdates: e.target.checked 
                            } 
                          }));
                        }
                      }}
                      disabled={!isEditing}
                      className="rounded border-white/30 text-blue-400 focus:ring-blue-400 bg-transparent"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}