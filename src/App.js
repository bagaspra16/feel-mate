import React from 'react';
import './App.css';
import VoiceChat from './components/VoiceChat';
import { ConversationProvider } from './contexts/ConversationContext';

function App() {
  return (
    <ConversationProvider>
      <VoiceChat />
    </ConversationProvider>
  );
}

export default App;
