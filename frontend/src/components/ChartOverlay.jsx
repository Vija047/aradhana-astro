import React from 'react';
import { ZODIAC_GLYPHS } from '../utils/astrology';

function ChartOverlay({ fullName, birthChart, onClose }) {
  if (!birthChart) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 12, 0.85)',
        backdropFilter: 'blur(15px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel glow-active"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '32px',
          background: 'rgba(19, 19, 20, 0.95)',
          position: 'relative',
          animation: 'fadeInUp 0.4s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--on-surface-variant)',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="text-gold-glow" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Sacred Alignment</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginBottom: '24px' }}>
          Birth chart computed for {fullName || 'Seeker'} on {birthChart.inputs?.date} at {birthChart.inputs?.time}.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(birthChart.placements || {}).map(([planet, placement]) => {
            const zSign = placement.sign || '';
            return (
              <div
                key={planet}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="text-gold-glow" style={{ fontSize: '1.4rem', width: '24px', textAlign: 'center' }}>
                    {ZODIAC_GLYPHS[zSign] || '✦'}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--on-surface)' }}>{planet}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Sign: {zSign}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', fontWeight: '500' }}>
                    {placement.degree}°
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                    House {placement.house}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
          ✦ Cast deterministically using geocoded coordinates: {birthChart.inputs?.latitude?.toFixed(4)}°, {birthChart.inputs?.longitude?.toFixed(4)}° ✦
        </div>
      </div>
    </div>
  );
}

export default ChartOverlay;
