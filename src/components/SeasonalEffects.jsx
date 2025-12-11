import React from "react";
import "./SeasonalEffects.css";

// Efecto de Nieve (Invierno)
export const SnowEffect = () => {
  const snowflakes = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${12 + Math.random() * 18}s`
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

// Efecto de Hojas de Otoño
export const AutumnLeavesEffect = () => {
  const leaves = Array.from({ length: 30 }, (_, i) => i);
  const leafTypes = ["🍂", "🍁"];
  
  return (
    <div className="leaves-container">
      {leaves.map((leaf) => (
        <div
          key={leaf}
          className="autumn-leaf"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 12}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {leafTypes[Math.floor(Math.random() * leafTypes.length)]}
        </div>
      ))}
    </div>
  );
};

// Efecto de Flores/Pétalos (Primavera)
export const SpringFlowersEffect = () => {
  const petals = Array.from({ length: 25 }, (_, i) => i);
  const petalTypes = ["🌸", "🌺", "🌼"];
  
  return (
    <div className="flowers-container">
      {petals.map((petal) => (
        <div
          key={petal}
          className="spring-petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        >
          {petalTypes[Math.floor(Math.random() * petalTypes.length)]}
        </div>
      ))}
    </div>
  );
};

// Efecto de Sol (Verano)
export const SummerSunEffect = ({ className = "" }) => {
  return (
    <div className={`sun-container ${className}`}>
      <div className="sun-rays">
        <div className="sun-ray ray-1"></div>
        <div className="sun-ray ray-2"></div>
        <div className="sun-ray ray-3"></div>
        <div className="sun-ray ray-4"></div>
        <div className="sun-ray ray-5"></div>
        <div className="sun-ray ray-6"></div>
        <div className="sun-ray ray-7"></div>
        <div className="sun-ray ray-8"></div>
      </div>
      <div className="sun-center">☀️</div>
    </div>
  );
};

// Luces Navideñas (Invierno)
export const ChristmasLights = ({ className = "" }) => {
  const lights = Array.from({ length: 18 }, (_, i) => i);
  const colors = ["#FFD700", "#FF0000", "#0000FF", "#00FF00", "#FF8C00", "#FFD700", "#FF0000", "#0000FF", "#FFD700", "#FF8C00", "#FF0000", "#0000FF", "#FFD700", "#FF8C00", "#FF0000", "#0000FF", "#FFD700", "#FF0000"];
  
  return (
    <div className={`christmas-lights ${className}`}>
      <svg className="lights-wire" viewBox="0 0 1000 80" preserveAspectRatio="none">
        <path
          d="M 0,40 Q 120,10 240,25 T 480,20 Q 600,35 720,25 T 960,30 Q 980,35 1000,30"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {lights.map((light, index) => {
        const position = (index * 100) / lights.length;
        // Crear ondas más pronunciadas para seguir el cable
        const waveOffset = Math.sin((index / lights.length) * Math.PI * 3.5) * 20;
        const isUpper = Math.sin((index / lights.length) * Math.PI * 3.5) > 0;
        const lightStyle = {
          left: `${position}%`,
          top: `${isUpper ? 20 + waveOffset * 0.3 : 40 + Math.abs(waveOffset) * 0.2}%`,
          backgroundColor: colors[index],
          animationDelay: `${index * 0.15}s`,
          '--light-color': colors[index]
        };
        
        return (
          <div
            key={light}
            className="light-bulb"
            style={lightStyle}
          >
            <div className="light-base"></div>
          </div>
        );
      })}
    </div>
  );
};

