import { useState, useEffect } from 'react';
import './App.css';
import OnboardingView from './components/OnboardingView';
import LoadingView from './components/LoadingView';
import ChatView from './components/ChatView';
import ErrorView from './components/ErrorView';
import ChartOverlay from './components/ChartOverlay';

const BACKEND_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://aradhana-astro.onrender.com');

function App() {
  // Navigation & Page State
  const [view, setView] = useState('ONBOARDING'); // ONBOARDING, LOADING, CHAT, ERROR
  
  // Onboarding Form Inputs
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [noTime, setNoTime] = useState(false);

  // Chat State
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [activityState, setActivityState] = useState(null); // String describing tool activity
  
  // Dynamic Astrological State parsed from tools
  const [birthChart, setBirthChart] = useState(null);
  const [dailyTransits, setDailyTransits] = useState(null);
  const [showChartOverlay, setShowChartOverlay] = useState(false);

  // Load existing session from localStorage if present
  useEffect(() => {
    const cachedSession = localStorage.getItem('aradhana_session_id');
    const cachedView = localStorage.getItem('aradhana_view');
    const cachedChart = localStorage.getItem('aradhana_birth_chart');
    const cachedMessages = localStorage.getItem('aradhana_messages');
    const cachedFullName = localStorage.getItem('aradhana_full_name');
    const cachedDob = localStorage.getItem('aradhana_dob');
    const cachedTob = localStorage.getItem('aradhana_tob');
    const cachedPob = localStorage.getItem('aradhana_pob');
    const cachedNoTime = localStorage.getItem('aradhana_no_time');

    if (cachedSession && cachedView === 'CHAT') {
      setSessionId(cachedSession);
      setView('CHAT');
      if (cachedChart) setBirthChart(JSON.parse(cachedChart));
      if (cachedMessages) setMessages(JSON.parse(cachedMessages));
      if (cachedFullName) setFullName(cachedFullName);
      if (cachedDob) setDob(cachedDob);
      if (cachedTob) setTob(cachedTob);
      if (cachedPob) setPob(cachedPob);
      if (cachedNoTime) setNoTime(cachedNoTime === 'true');
    }
  }, []);

  // Save session details to localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('aradhana_session_id', sessionId);
      localStorage.setItem('aradhana_view', view);
      localStorage.setItem('aradhana_messages', JSON.stringify(messages));
      localStorage.setItem('aradhana_full_name', fullName);
      localStorage.setItem('aradhana_dob', dob);
      localStorage.setItem('aradhana_tob', tob);
      localStorage.setItem('aradhana_pob', pob);
      localStorage.setItem('aradhana_no_time', String(noTime));
      if (birthChart) {
        localStorage.setItem('aradhana_birth_chart', JSON.stringify(birthChart));
      }
    }
  }, [sessionId, view, messages, birthChart, fullName, dob, tob, pob, noTime]);

  // Handle resetting the session to onboarding
  const handleResetSession = () => {
    localStorage.clear();
    setSessionId('');
    setMessages([]);
    setBirthChart(null);
    setDailyTransits(null);
    setFullName('');
    setDob('');
    setTob('');
    setPob('');
    setNoTime(false);
    setView('ONBOARDING');
  };

  // Submit Onboarding details
  const handleBeginReading = (e) => {
    e.preventDefault();
    if (!fullName || !dob || !pob || (!tob && !noTime)) {
      alert('Please fill in all birth details to begin your reading.');
      return;
    }

    const birthTime = noTime ? '12:00' : tob;
    const cleanSession = `session_${Date.now()}`;
    setSessionId(cleanSession);

    // Initial message to trigger the chart calculation
    const initialPrompt = `Hello, I've arrived. My name is ${fullName}. I was born on ${dob} at ${birthTime} in ${pob}. Please compute my birth chart and begin my reading.`;

    // 1. Transition to loading
    setView('LOADING');

    // 2. We start fetching/streaming immediately in the background
    // but keep loading screen visible for a minimum time (e.g. 3.5s) to let the mandala spin
    const minLoadTimer = setTimeout(() => {
      setView('CHAT');
    }, 3500);

    // Run the chat streaming
    sendChatMessage(initialPrompt, cleanSession, minLoadTimer);
  };

  // Send message from input bar
  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    
    const textToSend = inputText;
    setInputText('');
    
    // Add user message to list
    setMessages(prev => [
      ...prev, 
      { 
        role: 'user', 
        content: textToSend, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
    
    sendChatMessage(textToSend, sessionId);
  };

  // Triggered by action chips inside the agent message
  const handleChipAction = (chipText) => {
    if (isStreaming) return;
    setMessages(prev => [
      ...prev, 
      { 
        role: 'user', 
        content: chipText, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }
    ]);
    sendChatMessage(chipText, sessionId);
  };

  // Main SSE streaming connection logic
  const sendChatMessage = async (msgText, session, loadTimer = null) => {
    setIsStreaming(true);
    setStreamingContent('');
    setActivityState('Connecting to the cosmos...');

    let accumulatedContent = '';

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: msgText,
          sessionId: session
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep partial line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const payload = JSON.parse(dataStr);

              if (payload.type === 'token') {
                accumulatedContent += payload.content;
                setStreamingContent(accumulatedContent);
              } else if (payload.type === 'tool_start') {
                if (payload.tool === 'geocode_place') {
                  setActivityState('Resolving birth coordinates...');
                } else if (payload.tool === 'compute_birth_chart') {
                  setActivityState('Computing birth chart alignments...');
                } else if (payload.tool === 'get_daily_transits') {
                  setActivityState('Casting daily planetary transits...');
                } else if (payload.tool === 'knowledge_lookup') {
                  setActivityState('Searching cosmic library...');
                } else {
                  setActivityState(`Aligning ${payload.tool}...`);
                }
              } else if (payload.type === 'tool_end') {
                setActivityState(null);
                
                // Parse outputs for local state update
                if (payload.tool === 'compute_birth_chart' && payload.output) {
                  try {
                    const parsedOutput = JSON.parse(payload.output);
                    if (parsedOutput.placements) {
                      setBirthChart(parsedOutput);
                    }
                  } catch (e) {
                    console.error('Failed to parse birth chart tool output', e);
                  }
                } else if (payload.tool === 'get_daily_transits' && payload.output) {
                  try {
                    const parsedOutput = JSON.parse(payload.output);
                    if (parsedOutput.transits) {
                      setDailyTransits(parsedOutput);
                    }
                  } catch (e) {
                    console.error('Failed to parse transit tool output', e);
                  }
                }
              } else if (payload.type === 'done') {
                // done payload handling
              } else if (payload.type === 'error') {
                throw new Error(payload.message || 'Unknown cosmic disturbance');
              }
            } catch (err) {
              console.warn('Error parsing SSE payload', err);
            }
          }
        }
      }

      // Finish streaming and append AI response to list
      setMessages(prev => {
        const finalAIContent = accumulatedContent || 'The stars have completed their calculations.';
        const isInitialReading = prev.length <= 1; // It was the first message
        
        return [
          ...prev, 
          { 
            role: 'assistant', 
            content: finalAIContent,
            isComplexCard: isInitialReading, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ];
      });
      setStreamingContent('');
      setActivityState(null);
      setIsStreaming(false);

    } catch (error) {
      console.error('SSE Error:', error);
      if (loadTimer) clearTimeout(loadTimer);
      setView('ERROR');
      setIsStreaming(false);
      setActivityState(null);
    }
  };

  return (
    <>
      {/* Background stardust glow components */}
      <div className="bg-starfield"></div>
      <div className="bg-zodiac-container">
        <div className="zodiac-wheel-outer"></div>
        <div className="zodiac-wheel-inner"></div>
      </div>
      
      <div className="zodiac-glyph float-slow" style={{ top: '20%', left: '10%' }}>♈︎</div>
      <div className="zodiac-glyph float-slow" style={{ bottom: '20%', right: '10%', animationDelay: '-5s' }}>♋︎</div>
      <div className="zodiac-glyph float-slow" style={{ top: '65%', left: '8%', animationDelay: '-8s' }}>♊︎</div>
      <div className="zodiac-glyph float-slow" style={{ top: '15%', right: '15%', animationDelay: '-3s' }}>♏︎</div>

      {/* View router */}
      {view === 'ONBOARDING' && (
        <OnboardingView
          fullName={fullName}
          setFullName={setFullName}
          dob={dob}
          setDob={setDob}
          tob={tob}
          setTob={setTob}
          pob={pob}
          setPob={setPob}
          noTime={noTime}
          setNoTime={setNoTime}
          onSubmit={handleBeginReading}
        />
      )}

      {view === 'LOADING' && <LoadingView />}

      {view === 'CHAT' && (
        <ChatView
          messages={messages}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          activityState={activityState}
          inputText={inputText}
          setInputText={setInputText}
          dailyTransits={dailyTransits}
          birthChart={birthChart}
          onSendMessageSubmit={handleSendMessageSubmit}
          onChipAction={handleChipAction}
          onResetSession={handleResetSession}
          onShowChart={() => setShowChartOverlay(true)}
        />
      )}

      {view === 'ERROR' && <ErrorView onReset={handleResetSession} />}

      {/* Astro Overlay details */}
      {showChartOverlay && birthChart && (
        <ChartOverlay
          fullName={fullName}
          birthChart={birthChart}
          onClose={() => setShowChartOverlay(false)}
        />
      )}
    </>
  );
}

export default App;
