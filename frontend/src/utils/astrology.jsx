import React from 'react';

// Zodiac sign glyphs dictionary
export const ZODIAC_GLYPHS = {
  Aries: '♈︎',
  Taurus: '♉︎',
  Gemini: '♊︎',
  Cancer: '♋︎',
  Leo: '♌︎',
  Virgo: '♍︎',
  Libra: '♎︎',
  Scorpio: '♏︎',
  Sagittarius: '♐︎',
  Capricorn: '♑︎',
  Aquarius: '♒︎',
  Pisces: '♓︎'
};

// Helper to parse **text** into <strong>
export const parseBoldText = (text) => {
  const regex = /\*\*(.*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} style={{ color: 'var(--on-surface)', fontWeight: '600' }}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

// Quick helper to render simple formatting in messages (bold, line breaks, bullet lists)
export const renderMessageContent = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const trimmed = line.trim();
    
    // Render simple lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <ul key={index} className="list-disc pl-5 my-1 text-on-surface-variant">
          <li>{parseBoldText(trimmed.slice(2))}</li>
        </ul>
      );
    }
    
    // Render subheaders
    if (trimmed.startsWith('### ')) {
      return <h3 key={index} className="text-md font-serif mt-3 mb-1 text-gold-glow">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={index} className="text-lg font-serif mt-4 mb-2 text-gold-glow">{trimmed.slice(3)}</h2>;
    }
    
    if (trimmed === '') return <div key={index} className="h-2" />;
    
    return <p key={index} className="mb-2 text-on-surface-variant leading-relaxed">{parseBoldText(line)}</p>;
  });
};
