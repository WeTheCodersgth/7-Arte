import React, { useState, useEffect } from 'react';
import { Conteudo } from '../../banco/types';

interface PropsModalDownload {
  filme: Conteudo;
  aoFechar: () => void;
}

type Estado = 'confirm' | 'downloading' | 'done';

const ModalDownload = ({ filme, aoFechar }: PropsModalDownload) => {
    const [estado, setEstado] = useState<Estado>('confirm');
    const [fechando, setFechando] = useState(false);
    const [progresso, setProgresso] = useState(0);

    useEffect(() => {
        const lidarComTeclaPressionada = (e: KeyboardEvent) => {
            if (e.key === 'Escape') lidarComFechamento();
        };
        document.addEventListener('keydown', lidarComTeclaPressionada);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', lidarComTeclaPressionada);
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        let intervalo: number | undefined;
        if (estado === 'downloading') {
            intervalo = window.setInterval(() => {
                setProgresso(anterior => {
                    if (anterior >= 100) {
                        clearInterval(intervalo);
                        setEstado('done');
                        return 100;
                    }
                    return anterior + 1;
                });
            }, 50); // Simula a velocidade do download
        }
        return () => clearInterval(intervalo);
    }, [estado]);

    const lidarComFechamento = () => {
        setFechando(true);
        setTimeout(() => aoFechar(), 300);
    };
    
    const renderizarConteudo = () => {
        switch (estado) {
            case 'confirm':
                return (
                    <>
                        <div className="text-center">
                            <i className="fas fa-cloud-download-alt text-5xl text-brand-accent mb-4"></i>
                            <h2 className="text-3xl font-bold text-white mb-2">Preparar Download</h2>
                            <p className="text-brand-secondary mb-6">Você está prestes a baixar "{filme.titulo}".</p>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => setEstado('downloading')}
                                className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-base"
                            >
                                Iniciar Download
                            </button>
                            <button
                                onClick={lidarComFechamento}
                                className="w-full bg-gray-700 text-brand-secondary font-bold py-3 px-6 rounded-full hover:bg-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                );
            case 'downloading':
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Baixando...</h2>
                        <p className="text-brand-secondary mb-6 truncate">{filme.titulo}</p>
                        <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                            <div
                                className="bg-brand-accent h-4 rounded-full transition-all duration-150"
                                style={{ width: `${progresso}%` }}
                            ></div>
                        </div>
                        <p className="text-white font-bold text-2xl mb-6">{progresso}%</p>
                        <button
                            onClick={lidarComFechamento}
                            className="w-full bg-gray-700 text-brand-secondary font-bold py-2 px-6 rounded-full hover:bg-gray-600 transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                );
            case 'done':
                 return (
                    <div className="text-center">
                        <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                        <h2 className="text-3xl font-bold text-white mb-2">Download Concluído</h2>
                        <p className="text-brand-secondary mb-6">"{filme.titulo}" foi salvo em seu dispositivo.</p>
                         <button
                            onClick={lidarComFechamento}
                            className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                );
        }
    };
    
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${fechando ? 'opacity-0' : 'opacity-100'}`}
            onClick={lidarComFechamento}
        >
            <div
                className={`relative w-full max-w-4xl min-h-[500px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex transition-transform duration-300 ${fechando ? 'scale-95' : 'scale-100'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={lidarComFechamento} className="absolute top-4 right-5 text-gray-500 hover:text-white transition-colors z-20" aria-label="Fechar modal">
                    <i className="fas fa-times text-xl"></i>
                </button>
                
                {/* Coluna Visual Esquerda */}
                <div className="hidden md:block md:w-1/2 lg:w-5/12 relative">
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out" style={{ backgroundImage: `url(${filme.imagemFundo})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                        <img src={filme.poster} alt={filme.titulo} className="w-2/3 rounded-lg shadow-lg mb-4" />
                        <h2 className="text-3xl font-bold font-display leading-tight">{filme.titulo}</h2>
                        <p className="text-brand-secondary mt-2">Seu conteúdo, disponível onde você estiver.</p>
                    </div>
                </div>

                {/* Coluna do Conteúdo Direita */}
                <div className="relative w-full md:w-1/2 lg:w-7/12 flex flex-col items-center justify-center p-8 sm:p-12">
                    <div className="relative w-full max-w-md">
                        {renderizarConteudo()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ModalDownload;