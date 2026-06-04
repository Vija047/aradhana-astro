import React from 'react';

function ErrorView({ onReset }) {
  return (
    <div className="error-viewport fade-in-up">
      <div className="glass-rose">
        <div className="error-icon-wrapper">
          <span className="material-symbols-outlined">error</span>
        </div>
        <h1 className="error-title font-serif text-gold-glow">Cosmic Disturbance</h1>
        <p className="error-desc">Something shifted in the cosmos. Please check your connection and try again.</p>
        <button className="btn-primary error-btn-retry" onClick={onReset}>
          <span className="material-symbols-outlined">refresh</span>
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorView;
