import React from 'react';

function OnboardingView({
  fullName,
  setFullName,
  dob,
  setDob,
  tob,
  setTob,
  pob,
  setPob,
  noTime,
  setNoTime,
  onSubmit
}) {
  return (
    <div className="app-viewport fade-in-up">
      <div className="onboarding-container">
        <div className="onboarding-card glass-panel glow-active">
          {/* Inner subtle glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(233,195,73,0.06), transparent)',
            pointerEvents: 'none'
          }}></div>
          
          <div className="onboarding-header">
            <h1>Tell me when you arrived</h1>
            <p>Your natal chart is the precise map of the cosmos at your exact moment of birth.</p>
          </div>

          <form className="onboarding-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                className="input-ghost"
                id="fullName"
                type="text"
                placeholder="How should we address you?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dob">Date of Birth</label>
              <input
                className="input-ghost"
                id="dob"
                type="date"
                style={{ colorScheme: 'dark' }}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <div style={{ opacity: noTime ? 0.35 : 1, transition: 'opacity 0.3s' }}>
                  <label className="form-label" htmlFor="tob">Time of Birth</label>
                  <input
                    className="input-ghost"
                    id="tob"
                    type="time"
                    style={{ colorScheme: 'dark', width: '100%' }}
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    disabled={noTime}
                    required={!noTime}
                  />
                </div>
              </div>
              
              <div className="toggle-switch-container">
                <span className="toggle-switch-label">I don't know my exact time</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={noTime}
                    onChange={(e) => setNoTime(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pob">Place of Birth</label>
              <div className="input-icon-wrapper">
                <span className="material-symbols-outlined">location_on</span>
                <input
                  className="input-ghost"
                  id="pob"
                  type="text"
                  placeholder="City, State, Country"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn-primary onboarding-btn-submit" type="submit">
              Begin My Reading
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>

            <p className="onboarding-footer">
              Your details are used only to compute your birth chart.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OnboardingView;
