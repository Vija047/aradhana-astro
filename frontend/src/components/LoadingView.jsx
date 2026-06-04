import React from 'react';

function LoadingView() {
  return (
    <div className="app-viewport">
      <div className="loading-viewport fade-in-up">
        <div className="mandala-container">
          <div className="mandala-halo"></div>
          <img
            className="mandala-img"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF0OtnDhqHdPypuYnd2CfZRfxcKcuwGkjRz5uT80XIcDT3d7HhU9U-n3GhMgAgzKbVodAqzeOCmOt365fh09cKnMMF_liYEEJBRhQyI2rAED5zIDOgREgQ6vXosLSPs4cVRSrLe4Ur_i0fVeXgo9PSUscfLya3z5lspR2znYPa_bbCoeePEUf0NzqaAIauXxeZCrlJLIc801R4WIXB6AoY5Qb3LyPXSeYhQVMZWkqeUbGV1Sf5DqU0u3tkflo3MzalyU7DgXB96-HH"
            alt="Celestial loading mandala wheel"
          />
        </div>
        <div className="loading-text">
          <h1 className="text-gold-glow">The stars are aligning...</h1>
          <p>Seeking clarity in the cosmos and preparing your sacred space.</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingView;
