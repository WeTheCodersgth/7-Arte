import React, { useEffect, useState } from 'react';

interface PropsSplashScreen {
  visivel: boolean;
}

const SplashScreen = ({ visivel }: PropsSplashScreen) => {
  const [animar, setAnimar] = useState(false);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  
  // Controla o início da animação para garantir que ela reinicie toda vez que o splash for exibido
  useEffect(() => {
    if (visivel) {
      // Pequeno atraso para permitir que o componente renderize antes de aplicar a transição
      const timer = setTimeout(() => setAnimar(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimar(false);
    }
  }, [visivel]);

  return (
    <div className={`fixed inset-0 bg-brand-background z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${visivel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* SVG para o círculo de progresso */}
        <svg
          className="absolute w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Círculo de fundo (trilha) */}
          <circle
            className="text-gray-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
          {/* Círculo de progresso (preenchimento) */}
          <circle
            className="text-brand-accent"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
            style={{
              strokeDashoffset: animar ? 0 : circumference,
              transition: animar ? 'stroke-dashoffset 4.8s linear' : 'none',
            }}
          />
        </svg>
        {/* Logo */}
        <img src="assets/img/logo.png" alt="7ª Arte Logo" className="w-32 h-auto" />
      </div>
      <p className="mt-8 text-base md:text-lg text-brand-secondary tracking-wider font-display text-center px-4">
        Cinema a qualquer hora em qualquer lugar
      </p>
    </div>
  );
};

export default SplashScreen;