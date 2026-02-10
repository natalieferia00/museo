import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <header className="hero-container">
      <div className="hero-content">
        <span className="hero-label">Exhibición Permanente</span>
        <h1 className="hero-title">Museo Artium</h1>
        <div className="fact-card">
          <p className="fact-label">¿SABÍAS QUE?</p>
          <p className="fact-text">
            "El David de Miguel Ángel fue esculpido en un bloque de mármol que estuvo abandonado por 25 años porque otros artistas decían que tenía demasiadas imperfecciones."
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;