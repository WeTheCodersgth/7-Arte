import React, { useState, useEffect, useRef } from 'react';

interface PropsDownload {
  variante?: 'button' | 'icon';
  aoClicar?: () => void;
}

const Download = ({ variante = 'button', aoClicar }: PropsDownload) => {
  const [estado, setEstado] = useState<'idle' | 'downloading' | 'done'>('idle');
  const refTimers = useRef<number[]>([]);

  const limparTodosTimers = () => {
    refTimers.current.forEach(timer => clearTimeout(timer));
    refTimers.current = [];
  };

  useEffect(() => {
    return () => limparTodosTimers();
  }, []);

  const iniciarDownloadIcone = () => {
    setEstado('downloading');
    const timerDownload = setTimeout(() => {
      setEstado('done');
      const timerConcluido = setTimeout(() => setEstado('idle'), 2000);
      refTimers.current.push(timerConcluido);
    }, 5000);
    refTimers.current.push(timerDownload);
  };

  const lidarComClique = () => {
    if (estado !== 'idle') return;
    
    limparTodosTimers();

    if (aoClicar) {
      aoClicar();
    } else if (variante === 'icon') {
      iniciarDownloadIcone();
    }
  };

  if (variante === 'icon') {
    let classeIcone = 'fa-download';
    let desabilitado = estado !== 'idle';
    let ariaLabel = 'Baixar';

    if (estado === 'downloading') {
      classeIcone = 'fa-circle-notch fa-spin';
      ariaLabel = 'Baixando';
    }
    if (estado === 'done') {
      classeIcone = 'fa-check-circle text-green-400';
      ariaLabel = 'Download concluído';
    }

    return (
      <button 
        onClick={lidarComClique} 
        disabled={desabilitado} 
        className="text-brand-accent text-lg md:text-xl w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:text-brand-secondary"
        aria-label={ariaLabel}
      >
        <i className={`fas ${classeIcone}`}></i>
      </button>
    );
  }

  return (
    <button onClick={lidarComClique} className="bg-gray-700 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 active:scale-95 transform transition-all duration-300 w-full sm:w-auto flex items-center justify-center">
      <i className="fas fa-download mr-2"></i>
      <span>Baixar</span>
    </button>
  );
};

export default Download;