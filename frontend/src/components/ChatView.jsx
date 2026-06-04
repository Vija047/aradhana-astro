import React, { useEffect, useRef } from 'react';
import { renderMessageContent, ZODIAC_GLYPHS } from '../utils/astrology';

function ChatView({
  messages,
  streamingContent,
  isStreaming,
  activityState,
  inputText,
  setInputText,
  dailyTransits,
  birthChart,
  onSendMessageSubmit,
  onChipAction,
  onResetSession,
  onShowChart
}) {
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom when message state updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent, activityState]);

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-title text-gold-glow">
          Aradhana ✦
        </div>
        
        <div className="chat-header-actions">
          {birthChart && (
            <button
              className="btn-ghost"
              onClick={onShowChart}
              style={{ padding: '6px 14px', fontSize: '0.7rem' }}
            >
              View Natal Placements
            </button>
          )}
          <button 
            className="btn-icon-header" 
            onClick={onResetSession}
            title="Reset session and birth details"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </header>

      {/* Conversation canvas */}
      <main className="chat-history no-scrollbar">
        <div className="chat-system-marker">
          TODAY • {dailyTransits ? `SUN IN ${dailyTransits.transits?.Sun?.sign.toUpperCase()} • MOON IN ${dailyTransits.transits?.Moon?.sign.toUpperCase()}` : 'THE MOON IS IN PISCES'}
        </div>

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          
          if (isUser) {
            return (
              <div key={index} className="message-user fade-in-up">
                <div className="bubble-user">
                  {msg.content}
                </div>
                <div className="message-time-user">{msg.timestamp}</div>
              </div>
            );
          }

          // Rendering AI Assistant response.
          // If it's a complex card (e.g. the first chart reading message), wrap in elegant headers
          if (msg.isComplexCard && birthChart) {
            const placements = birthChart.placements || {};
            const sunSign = placements.Sun?.sign || '';
            const moonSign = placements.Moon?.sign || '';
            const ascSign = placements.Ascendant?.sign || '';
            
            return (
              <div key={index} className="message-agent fade-in-up">
                <div className="agent-label">
                  <span className="agent-label-symbol">✦</span>
                  <span className="agent-label-name">Aradhana</span>
                </div>
                
                <div className="bubble-agent-complex glass-panel glow-active">
                  <div className="agent-complex-header">
                    <div className="agent-complex-header-zodiac">{ZODIAC_GLYPHS[sunSign] || '✦'}</div>
                    <h3 className="text-gold-glow">{sunSign} Sun, {moonSign} Moon</h3>
                    <p>Ascendant in {ascSign}</p>
                  </div>
                  
                  <div className="agent-complex-body">
                    {renderMessageContent(msg.content)}
                    
                    <div className="agent-complex-actions">
                      <button
                        className="btn-ghost btn-chip-action"
                        onClick={() => onChipAction('Give me a grounding ritual based on my chart')}
                      >
                        <span className="material-symbols-outlined text-gold-glow icon-gold-glow">auto_awesome</span>
                        Grounding Ritual
                      </button>
                      
                      <button
                        className="glass-panel btn-chip-action"
                        onClick={onShowChart}
                        style={{ color: 'var(--on-surface)' }}
                      >
                        <span className="material-symbols-outlined">explore</span>
                        View Full Chart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="message-time-agent">{msg.timestamp}</div>
              </div>
            );
          }

          // Default agent message bubble
          return (
            <div key={index} className="message-agent fade-in-up">
              <div className="agent-label">
                <span className="agent-label-symbol">✦</span>
                <span className="agent-label-name">Aradhana</span>
              </div>
              <div className="bubble-agent glass-panel glow-active">
                {renderMessageContent(msg.content)}
              </div>
              <div className="message-time-agent">{msg.timestamp}</div>
            </div>
          );
        })}

        {/* SSE Streaming Buffer Response */}
        {isStreaming && streamingContent && (
          <div className="message-agent">
            <div className="agent-label">
              <span className="agent-label-symbol">✦</span>
              <span className="agent-label-name">Aradhana</span>
            </div>
            <div className="bubble-agent glass-panel glow-active">
              {renderMessageContent(streamingContent)}
            </div>
          </div>
        )}

        {/* Dynamic Activity/Tool Indicator */}
        {activityState && (
          <div className="tool-activity-indicator fade-in-up">
            <div className="activity-chip glass-panel glow-pulse">
              <span className="material-symbols-outlined activity-chip-spinner">sync</span>
              <span className="activity-chip-text">{activityState}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Bottom Chat Tray */}
      <div className="chat-input-area">
        <form className="chat-input-wrapper glass-panel" onSubmit={onSendMessageSubmit}>
          <div className="chat-input-glow"></div>
          
          <button 
            type="button" 
            className="chat-btn-addon"
            onClick={() => onChipAction('What transits are affecting me today?')}
            title="Ask about today's transits"
          >
            <span className="material-symbols-outlined">explore</span>
          </button>
          
          <input
            className="chat-input-text"
            type="text"
            placeholder="Share your thoughts with Aradhana..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isStreaming}
          />
          
          <button 
            type="button" 
            className="chat-btn-voice"
            onClick={() => onChipAction('Explain my Scorpio Moon placement')}
            title="Explain Scorpio Moon placement"
          >
            <span className="material-symbols-outlined">auto_stories</span>
          </button>
          
          <button className="chat-btn-send" type="submit" disabled={!inputText.trim() || isStreaming}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatView;
