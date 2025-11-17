import React, { useState, useRef, useEffect, useCallback } from 'react';
import Download from './download';

interface PropsPlayer {
    src: string;
    poster: string;
    titulo: string;
    aoTerminar?: () => void;
}

// Formata o tempo em segundos para o formato MM:SS.

const formatarTempo = (tempoEmSegundos: number) => {
    if (isNaN(tempoEmSegundos) || tempoEmSegundos < 0) return '00:00';
    const minutos = Math.floor(tempoEmSegundos / 60);
    const segundos = Math.floor(tempoEmSegundos % 60);
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
};

const Player = ({ src, poster, titulo, aoTerminar }: PropsPlayer) => {
    // Refs para acessar elementos do DOM diretamente.
    const refVideo = useRef<HTMLVideoElement>(null);
    const refContainerPlayer = useRef<HTMLDivElement>(null);
    const refTimeoutControles = useRef<number | null>(null);
    const refInputProgresso = useRef<HTMLInputElement>(null);
    const refInputVolume = useRef<HTMLInputElement>(null);

    // Estados para controlar o player.
    const [reproduzindo, setReproduzindo] = useState(false);
    const [mudo, setMudo] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duracao, setDuracao] = useState(0);
    const [tempoAtual, setTempoAtual] = useState(0);
    const [controlesVisiveis, setControlesVisiveis] = useState(true);
    const [carregando, setCarregando] = useState(true);
    const [iniciado, setIniciado] = useState(false); // 
    
    // Esconde os controles após um período de inatividade.
  
    const esconderControles = useCallback(() => {
        if (refTimeoutControles.current) {
            clearTimeout(refTimeoutControles.current);
        }
        refTimeoutControles.current = window.setTimeout(() => {
            if (reproduzindo) {
                setControlesVisiveis(false);
            }
        }, 3000);
    }, [reproduzindo]);

    //  Mostra os controles e reinicia o timer para escondê-los.

    const mostrarControles = useCallback(() => {
        if (refTimeoutControles.current) {
            clearTimeout(refTimeoutControles.current);
        }
        setControlesVisiveis(true);
        esconderControles();
    }, [esconderControles]);

    // Efeito para gerenciar a visibilidade dos controles quando o estado de play/pause muda.
    useEffect(() => {
        mostrarControles();
        return () => {
            if (refTimeoutControles.current) {
                clearTimeout(refTimeoutControles.current);
            }
        };
    }, [reproduzindo, mostrarControles]);
    
    //  Atualiza o preenchimento visual de um input range (progresso e volume).

    const atualizarPreenchimentoRange = useCallback((refInput: React.RefObject<HTMLInputElement>, valor: number, maximo: number) => {
        if (refInput.current) {
            const progresso = (valor / maximo) * 100;
            refInput.current.style.setProperty('--track-progress', `${progresso}%`);
        }
    }, []);

    // Efeitos para atualizar o preenchimento das barras de progresso e volume.
    useEffect(() => {
        atualizarPreenchimentoRange(refInputProgresso, tempoAtual, duracao);
    }, [tempoAtual, duracao, atualizarPreenchimentoRange]);

    useEffect(() => {
        const volumeAtual = mudo ? 0 : volume;
        atualizarPreenchimentoRange(refInputVolume, volumeAtual, 1);
    }, [volume, mudo, atualizarPreenchimentoRange]);

    //  Lida com o primeiro clique no botão de play, iniciando o vídeo.

    const lidarComPlayInicial = () => {
        setIniciado(true);
        if (refVideo.current) {
            refVideo.current.play();
        }
    };
    
    //  Alterna entre play e pause.

    const alternarPlayPause = useCallback(() => {
        if (!refVideo.current || !iniciado) return;
        refVideo.current.paused ? refVideo.current.play() : refVideo.current.pause();
    }, [iniciado]);

    //  Avança ou retrocede o vídeo em uma quantidade específica de segundos.
    
    const lidarComBuscaTemporal = useCallback((quantidade: number) => {
        if (refVideo.current) {
            refVideo.current.currentTime += quantidade;
        }
    }, []);
    
    //  Lida com a mudança manual da barra de progresso.

    const lidarComMudancaProgresso = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!refVideo.current) return;
        const novoTempo = parseFloat(e.target.value);
        refVideo.current.currentTime = novoTempo;
        setTempoAtual(novoTempo);
    };

    //  Lida com a mudança manual da barra de volume.

    const lidarComMudancaVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!refVideo.current) return;
        const novoVolume = parseFloat(e.target.value);
        refVideo.current.volume = novoVolume;
        refVideo.current.muted = novoVolume === 0;
        setVolume(novoVolume);
        setMudo(novoVolume === 0);
    };

    //  Alterna o estado mudo do vídeo.

    const alternarMudo = useCallback(() => {
        if (!refVideo.current) return;
        const video = refVideo.current;
        const novoEstadoMudo = !video.muted;
        video.muted = novoEstadoMudo;
        setMudo(novoEstadoMudo);

        // Se o vídeo for desmutado e o volume estiver em 0, restaura para 100%.
        if (!novoEstadoMudo && video.volume === 0) {
            video.volume = 1;
            setVolume(1);
        }
    }, []);

    //  Alterna o modo de tela cheia.

    const alternarTelaCheia = useCallback(() => {
        if (!refContainerPlayer.current) return;
        if (!document.fullscreenElement) {
            refContainerPlayer.current.requestFullscreen().catch(err => {
                alert(`Erro ao tentar ativar o modo de tela cheia: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    // Efeito principal para adicionar e remover os listeners de evento do elemento <video>.
    useEffect(() => {
        const video = refVideo.current;
        if (!video) return;

        const atualizarEstadoReproducao = () => setReproduzindo(!video.paused);
        const atualizarEstadoCarregamento = () => setCarregando(video.readyState < 3);
        const atualizarTempo = () => setTempoAtual(video.currentTime);
        const atualizarDuracao = () => setDuracao(video.duration);
        
        video.addEventListener('play', atualizarEstadoReproducao);
        video.addEventListener('pause', atualizarEstadoReproducao);
        video.addEventListener('waiting', atualizarEstadoCarregamento);
        video.addEventListener('playing', atualizarEstadoCarregamento);
        video.addEventListener('timeupdate', atualizarTempo);
        video.addEventListener('loadedmetadata', atualizarDuracao);
        if (aoTerminar) video.addEventListener('ended', aoTerminar);
        
        return () => {
            video.removeEventListener('play', atualizarEstadoReproducao);
            video.removeEventListener('pause', atualizarEstadoReproducao);
            video.removeEventListener('waiting', atualizarEstadoCarregamento);
            video.removeEventListener('playing', atualizarEstadoCarregamento);
            video.removeEventListener('timeupdate', atualizarTempo);
            video.removeEventListener('loadedmetadata', atualizarDuracao);
            if (aoTerminar) video.removeEventListener('ended', aoTerminar);
        };
    }, [aoTerminar]);

    // Efeito para adicionar atalhos de teclado ao player.
    useEffect(() => {
        const lidarComTeclaPressionada = (e: KeyboardEvent) => {
            // Ignora atalhos se o foco estiver em um campo de texto.
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            mostrarControles();
            switch (e.code) {
                case 'Space': e.preventDefault(); alternarPlayPause(); break;
                case 'ArrowRight': lidarComBuscaTemporal(10); break;
                case 'ArrowLeft': lidarComBuscaTemporal(-10); break;
                case 'KeyM': alternarMudo(); break;
                case 'KeyF': alternarTelaCheia(); break;
            }
        };
        const container = refContainerPlayer.current;
        container?.addEventListener('keydown', lidarComTeclaPressionada);
        return () => container?.removeEventListener('keydown', lidarComTeclaPressionada);
    }, [alternarPlayPause, alternarTelaCheia, lidarComBuscaTemporal, alternarMudo, mostrarControles]);

    const volumeAtual = mudo ? 0 : volume;

    return (
        <div 
            ref={refContainerPlayer} 
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-black/50 outline-none"
            onMouseMove={mostrarControles}
            onMouseLeave={() => reproduzindo && esconderControles()}
            tabIndex={0}
        >
            <video
                ref={refVideo}
                src={src}
                className={`w-full h-full object-contain transition-opacity duration-300 ${iniciado ? 'opacity-100' : 'opacity-0'}`}
                onCanPlay={() => setCarregando(false)}
                onClick={alternarPlayPause}
                onDoubleClick={alternarTelaCheia}
                controls={false}
            />

            {/* Overlay inicial antes do vídeo começar */}
            {!iniciado && (
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }}>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <button 
                            onClick={lidarComPlayInicial}
                            className="w-24 h-24 rounded-full bg-brand-accent text-white text-5xl flex items-center justify-center backdrop-blur-sm hover:bg-red-700 transform hover:scale-110 transition-all duration-300 shadow-lg shadow-brand-accent/30"
                            aria-label="Play"
                        >
                            <i className="fas fa-play ml-2"></i>
                        </button>
                    </div>
                </div>
            )}
            
            {/* Indicador de carregamento */}
            {carregando && iniciado && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
                    <i className="fas fa-spinner fa-spin text-brand-accent text-5xl"></i>
                </div>
            )}
            
            {/* Logo como marca d'água */}
            <img src="assets/img/logo.png" alt="7ª Arte" className={`absolute top-4 right-4 md:top-6 md:right-6 w-20 md:w-24 opacity-80 transition-opacity duration-300 pointer-events-none ${controlesVisiveis && iniciado ? 'opacity-40' : 'opacity-0'}`} />

            {/* Container dos controles */}
            <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${controlesVisiveis && iniciado ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 md:p-6 pt-12 pointer-events-auto">
                    {/* Linha do Título */}
                    <h3 className="text-white text-lg md:text-xl font-bold drop-shadow-lg mb-2 truncate">{titulo}</h3>
                    
                    {/* Linha da Barra de Progresso */}
                    <div className="flex items-center gap-3">
                        <span className="text-white text-xs font-mono select-none">{formatarTempo(tempoAtual)}</span>
                        <input
                            ref={refInputProgresso}
                            type="range"
                            min="0"
                            max={isNaN(duracao) ? 0 : duracao}
                            value={tempoAtual}
                            onInput={lidarComMudancaProgresso} // 
                            className="custom-range flex-grow"
                            aria-label="Progresso do vídeo"
                        />
                        <span className="text-white text-xs font-mono select-none">{formatarTempo(duracao)}</span>
                    </div>

                    {/* Linha dos Botões de Controle */}
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={alternarPlayPause} className="text-brand-accent text-xl md:text-2xl w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-colors">
                                <i className={`fas ${reproduzindo ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>
                             <button onClick={() => lidarComBuscaTemporal(-10)} className="text-brand-accent text-base md:text-lg w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-colors">
                                <i className="fas fa-backward"></i>
                            </button>
                             <button onClick={() => lidarComBuscaTemporal(10)} className="text-brand-accent text-base md:text-lg w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-colors">
                                <i className="fas fa-forward"></i>
                            </button>
                            <div className="flex items-center group">
                                <button onClick={alternarMudo} className="text-brand-accent text-xl md:text-2xl w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-colors">
                                    <i className={`fas ${mudo || volume === 0 ? 'fa-volume-xmark' : volume > 0.5 ? 'fa-volume-high' : 'fa-volume-low'}`}></i>
                                </button>
                                <div className="volume-control-wrapper ml-2">
                                     <input
                                        ref={refInputVolume}
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volumeAtual}
                                        onInput={lidarComMudancaVolume}
                                        className="custom-range"
                                        aria-label="Controle de volume"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Download variante="icon" />
                            <button onClick={alternarTelaCheia} className="text-brand-accent text-lg md:text-xl w-10 h-10 flex items-center justify-center hover:bg-brand-accent/20 rounded-full transition-colors">
                                <i className="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;