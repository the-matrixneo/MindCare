# MindCare - AI Mental Health Assistant

[![Built with Bolt](https://img.shields.io/badge/Built%20with-Bolt-blue?style=for-the-badge&logo=lightning)](https://bolt.new)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge&logo=netlify)](https://kaleidoscopic-cocada-a52756.netlify.app)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

> 🧠 **Advanced AI-powered mental health companion with multilingual voice assistance, crisis intervention, and therapeutic art generation**

## 🌟 Features

### 🎯 Core Capabilities
- **🗣️ Multilingual Voice Assistant** - Support for 45+ languages with real-time speech recognition
- **🤖 AI Companion** - Powered by Google AI Edge for empathetic conversations
- **🎨 Art Therapy** - AI-generated therapeutic artwork based on emotional state
- **📹 TicTac Secure Chat** - End-to-end encrypted video sessions with licensed professionals
- **📊 Mood Tracking** - Advanced voice analysis for emotional state detection
- **🚨 Crisis Support** - Automatic risk detection with emergency intervention protocols

### 🔐 Security & Privacy
- **Biometric Authentication** - Face and voice recognition for secure access
- **End-to-End Encryption** - All communications are fully encrypted
- **Local Data Processing** - Sensitive data processed locally, never stored on servers
- **GDPR Compliant** - Full privacy protection and data control

### 🌍 Global Support
- **45+ Languages** - Native support for major world languages
- **Cultural Sensitivity** - AI trained on culturally appropriate responses
- **Local Emergency Services** - Integration with crisis hotlines worldwide
- **KIRAN Integration** - Direct connection to India's mental health helpline

## 🚀 Live Demo

**[Try MindCare Now →](https://kaleidoscopic-cocada-a52756.netlify.app)**

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Tailwind CSS** for responsive design
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons

### AI & ML
- **Google AI Edge** for natural language processing
- **MediaPipe** for voice and face analysis
- **TensorFlow Lite** for on-device AI inference
- **Web Speech API** for multilingual recognition

### Real-time Communication
- **WebRTC** for peer-to-peer video calls
- **Socket.io** for real-time messaging
- **End-to-end encryption** for secure communications

## 📱 Key Features Breakdown

### 🎙️ Voice Assistant
```typescript
// Supports 45+ languages with real-time emotion detection
const languages = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese',
  'Japanese', 'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian',
  // ... and 33 more languages
];
```

### 🧠 AI Companion
- **Emotion Recognition** - Analyzes text and voice for emotional state
- **Crisis Detection** - Automatic identification of high-risk situations
- **Therapeutic Responses** - Evidence-based mental health support
- **Cultural Adaptation** - Responses tailored to cultural context

### 🎨 Art Therapy
- **Mood-Based Generation** - Creates artwork based on emotional state
- **Therapeutic Benefits** - Each piece designed for specific mental health goals
- **Progress Tracking** - Visual journey of emotional healing
- **Personalization** - Adapts to user preferences and needs

### 📹 TicTac Secure Chat
- **Professional Network** - Connect with licensed mental health professionals
- **AI Moderation** - Real-time content analysis for safety
- **Emergency Protocols** - Automatic crisis intervention when needed
- **Global Coverage** - Available 24/7 worldwide

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser with WebRTC support

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/mindcare-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
VITE_GOOGLE_AI_API_KEY=your_google_ai_key
VITE_KIRAN_API_ENDPOINT=https://api.kiran.gov.in
VITE_EMERGENCY_SERVICES_API=your_emergency_api_key
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   AI Services   │    │   Backend       │
│   React + TS    │◄──►│   Google AI     │◄──►│   Node.js       │
│   Tailwind CSS  │    │   MediaPipe     │    │   WebRTC        │
│   Framer Motion │    │   TensorFlow    │    │   Socket.io     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   Edge AI       │    │   Emergency     │
│   Encrypted     │    │   Processing    │    │   Services      │
│   Biometrics    │    │   Voice/Face    │    │   KIRAN/911     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Usage Examples

### Voice Interaction
```javascript
// Start voice session in any language
voiceAssistant.startListening('hi'); // Hindi
voiceAssistant.startListening('es'); // Spanish
voiceAssistant.startListening('ar'); // Arabic
```

### Crisis Detection
```javascript
// Automatic risk assessment
const analysis = await ai.analyzeMessage(userInput);
if (analysis.riskLevel >= 8) {
  emergencyProtocol.activate();
}
```

### Art Therapy
```javascript
// Generate therapeutic art
const artwork = await artTherapy.generate({
  mood: 'anxious',
  style: 'watercolor',
  theme: 'nature'
});
```

## 🔒 Privacy & Security

- **🔐 Zero-Knowledge Architecture** - We never see your personal data
- **🏠 Local Processing** - AI runs on your device, not our servers
- **🔒 End-to-End Encryption** - All communications are fully encrypted
- **🗑️ Data Control** - Delete your data anytime, completely
- **🛡️ Biometric Security** - Face and voice authentication stored locally only

## 🌍 Global Mental Health Impact

### Supported Regions
- **🇮🇳 India** - KIRAN helpline integration
- **🇺🇸 United States** - NSPL and Crisis Text Line
- **🇬🇧 United Kingdom** - Samaritans support
- **🇪🇺 European Union** - Local crisis services
- **🌏 Asia-Pacific** - Regional mental health networks

### Crisis Intervention
- **Automatic Detection** - AI identifies crisis situations in real-time
- **Immediate Response** - Connect to local emergency services instantly
- **Professional Network** - Licensed therapists available 24/7
- **Cultural Sensitivity** - Support adapted to local customs and languages

## 📊 Subscription Plans

### 🆓 Free Tier
- Basic mood tracking
- 1 art therapy session/day
- 30 minutes TicTac chat/day
- Crisis support access

### ⭐ Premium ($9.99/month)
- Unlimited art therapy
- Unlimited TicTac sessions
- Advanced AI insights
- Priority crisis support
- Detailed analytics

### 👨‍⚕️ Professional ($19.99/month)
- Everything in Premium
- Client management tools
- HIPAA compliance
- API access
- White-label options

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork the repository
git clone https://github.com/your-username/mindcare-ai
cd mindcare-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Crisis Resources

### Immediate Help
- **🇮🇳 India**: KIRAN - 1800-599-0019
- **🇺🇸 USA**: Crisis Lifeline - 988
- **🇬🇧 UK**: Samaritans - 116 123
- **🌍 International**: [Find local resources](https://findahelpline.com)

### Emergency
- **🚨 Emergency Services**: 911 (US), 112 (EU), 100 (India)

## 🙏 Acknowledgments

- **Google AI** for advanced language models
- **KIRAN** for mental health crisis support
- **MediaPipe** for real-time AI processing
- **Mental Health Professionals** worldwide for their guidance
- **Open Source Community** for amazing tools and libraries

## 📞 Support

- **📧 Email**: support@mindcare-ai.com
- **💬 Discord**: [Join our community](https://discord.gg/mindcare)
- **📖 Documentation**: [docs.mindcare-ai.com](https://docs.mindcare-ai.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/mindcare-ai/issues)

---

<div align="center">

**Built with ❤️ using [Bolt](https://bolt.new) for global mental health**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/mindcare-ai)

</div>