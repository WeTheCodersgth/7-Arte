import React, { useState, useEffect } from 'react';
import { buscarConteudoPorId, buscarConteudoRelacionado } from '../../api/conteudoAPI';
import { Conteudo, Temporada } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';
import Download from '../../components/usuarios/download';
import ModalDownload from '../../components/usuarios/downloadModal';
import Player from '../../components/usuarios/player';

interface PropsDetalhes extends PropsPaginaAutenticada {
    idFilme?: number;
}

// Componente reutilizável para card de filme.
const CardFilme = ({ filme, onClick }: { filme: Conteudo, onClick: () => void }) => (
    <div onClick={onClick} className="group/card relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-accent/30 cursor-pointer">
        <img src={filme.poster} alt={filme.titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 p-3 w-full opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform group-hover/card:translate-y-0 translate-y-4">
            <h3 className="text-white font-bold text-sm truncate">{filme.titulo}</h3>
        </div>
    </div>
);

// Componente de acordeão para exibir temporadas e episódios de uma série.
const AcordeonTemporadas = ({ temporadas }: { temporadas: Temporada[] }) => {
    const [temporadaAberta, setTemporadaAberta] = useState<number | null>(1); // Abre a primeira temporada por padrão.

    const alternarTemporada = (numeroTemporada: number) => {
        setTemporadaAberta(temporadaAberta === numeroTemporada ? null : numeroTemporada);
    };

    return (
        <div className="container mx-auto px-6 lg:px-16 pb-16">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Temporadas e Episódios</h2>
            <div className="space-y-2">
                {temporadas.map((temporada) => (
                    <div key={temporada.numeroTemporada} className="bg-gray-800/50 rounded-lg overflow-hidden">
                        <button
                            onClick={() => alternarTemporada(temporada.numeroTemporada)}
                            className="w-full flex justify-between items-center p-4 text-left font-bold text-white hover:bg-gray-700/70 transition-colors"
                        >
                            <span>Temporada {temporada.numeroTemporada}</span>
                            <i className={`fas fa-chevron-down transition-transform duration-300 ${temporadaAberta === temporada.numeroTemporada ? 'rotate-180' : ''}`}></i>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out ${temporadaAberta === temporada.numeroTemporada ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 border-t border-gray-700">
                                {temporada.episodios.map(episodio => (
                                    <div key={episodio.numeroEpisodio} className="flex items-start gap-4 mb-4 last:mb-0 hover:bg-gray-900/40 p-2 rounded-md">
                                        <div className="w-1/3 sm:w-1/4 md:w-1/6">
                                            <img src={episodio.miniatura} alt={episodio.titulo} className="w-full aspect-video rounded-md object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{episodio.numeroEpisodio}. {episodio.titulo} <span className="text-sm font-normal text-brand-secondary ml-2">{episodio.duracao}</span></h4>
                                            <p className="text-sm text-brand-secondary mt-1 hidden sm:block">{episodio.descricao}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente de esqueleto de carregamento para a página de detalhes.
const EsqueletoCarregamento = () => (
    <div className="animate-pulse">
        <div className="h-[60vh] bg-gray-800/50"></div>
        <div className="container mx-auto px-6 lg:px-16 -mt-32 relative pb-16">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="aspect-[2/3] rounded-lg bg-gray-700/80"></div>
                </div>
                <div className="w-full md:w-3/4 pt-4">
                    <div className="h-10 bg-gray-700/80 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-700/80 rounded w-1/2 mb-6"></div>
                    <div className="h-20 bg-gray-700/80 rounded w-full mb-8"></div>
                    <div className="flex gap-4">
                        <div className="h-12 bg-gray-700/80 rounded-full w-48"></div>
                        <div className="h-12 bg-gray-700/80 rounded-full w-48"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Detalhes = ({ idFilme, navegar, usuarioAtual, abrirModalAutenticacao, aoAtualizarMinhaLista }: PropsDetalhes) => {
    const [filme, setFilme] = useState<Conteudo | null>(null);
    const [relacionados, setRelacionados] = useState<Conteudo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [trailerAberto, setTrailerAberto] = useState(false);
    const [modalDownloadAberto, setModalDownloadAberto] = useState(false);

    // Efeito para buscar os dados do filme/série quando o `idFilme` muda.
    useEffect(() => {
        if (!idFilme) return;

        setCarregando(true);
        // Simula o carregamento da rede.
        const timer = setTimeout(() => {
            const filmeEncontrado = buscarConteudoPorId(idFilme);
            if (filmeEncontrado) {
                setFilme(filmeEncontrado);
                // Busca conteúdo relacionado apenas se for um filme.
                if (filmeEncontrado.tipo === 'movie') {
                    setRelacionados(buscarConteudoRelacionado(idFilme));
                }
            }
            setCarregando(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [idFilme]);

    if (carregando) {
        return <EsqueletoCarregamento />;
    }

    if (!filme) {
        return (
            <div className="flex items-center justify-center h-screen -mt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-accent mb-4">404</h1>
                    <p className="text-brand-secondary">Filme ou série não encontrado.</p>
                    <button onClick={() => navegar('home')} className="mt-6 bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors duration-300">
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }

    const filmeEstaNaLista = usuarioAtual?.minhaLista.includes(filme.id) ?? false;

    return (
        <div className="text-brand-primary">
            {/* Seção Hero */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${filme.imagemFundo})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/80 to-transparent"></div>
            </div>
            
            {/* Seção de Conteúdo */}
            <div className="container mx-auto px-6 lg:px-16 -mt-20 md:-mt-32 relative z-10 pb-16">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full max-w-[250px] mx-auto md:mx-0 md:w-1/4 flex-shrink-0">
                        <img src={filme.poster} alt={filme.titulo} className="w-full h-auto rounded-lg shadow-2xl shadow-black/50" />
                    </div>
                    <div className="w-full md:w-3/4 text-center md:text-left pt-0 md:pt-8">
                        <h1 className="text-4xl md:text-5xl font-black font-display text-white drop-shadow-lg mb-2">{filme.titulo}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-brand-secondary text-sm mb-4">
                            <span>{filme.ano}</span>
                            <span className="w-1 h-1 bg-brand-secondary rounded-full"></span>
                            <span>{filme.duracao}</span>
                            <span className="w-1 h-1 bg-brand-secondary rounded-full"></span>
                            <div className="flex items-center gap-1.5">
                                <i className="fas fa-star text-yellow-400"></i>
                                <span>{filme.avaliacao}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                            {filme.generos.map(genero => (
                                <span key={genero} onClick={() => navegar('categorias', { tipo: 'genre', valor: genero, titulo: `Gênero: ${genero}` })} className="bg-gray-800 text-xs text-brand-secondary px-3 py-1 rounded-full cursor-pointer hover:bg-brand-accent hover:text-white transition-colors duration-200">{genero}</span>
                            ))}
                        </div>
                        <p className="text-brand-secondary mb-8 text-base leading-relaxed">{filme.descricao}</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 flex-wrap">
                            {filme.urlVideo && (
                                <button 
                                    onClick={() => navegar('assistir', { idFilme: filme.id })}
                                    className="bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 w-full sm:w-auto"
                                >
                                    <i className="fas fa-play mr-2"></i> Assistir Agora
                                </button>
                            )}
                             {filme.urlTrailer && (
                                <button 
                                    onClick={() => setTrailerAberto(true)}
                                    className="bg-gray-700 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 active:scale-95 transform transition-all duration-300 w-full sm:w-auto"
                                >
                                    <i className="fas fa-film mr-2"></i> Ver Trailer
                                </button>
                            )}
                            <button 
                                onClick={() => aoAtualizarMinhaLista(filme.id)} 
                                className={`font-bold py-3 px-8 rounded-full active:scale-95 transform transition-all duration-300 w-full sm:w-auto flex items-center justify-center ${
                                    filmeEstaNaLista
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-700 bg-opacity-60 hover:bg-gray-600 text-white'
                                }`}
                            >
                                <i className={`fas ${filmeEstaNaLista ? 'fa-check' : 'fa-plus'} mr-2`}></i>
                                <span>{filmeEstaNaLista ? 'Na Minha Lista' : 'Adicionar à Minha Lista'}</span>
                            </button>
                             <Download aoClicar={() => setModalDownloadAberto(true)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Condicional: Temporadas para séries, Relacionados para filmes */}
            {filme.tipo === 'series' && filme.temporadas && filme.temporadas.length > 0 ? (
                <AcordeonTemporadas temporadas={filme.temporadas} />
            ) : (
                relacionados.length > 0 && (
                    <div className="container mx-auto px-6 lg:px-16 pb-16">
                        <h2 className="text-2xl font-bold text-brand-primary mb-4">Você também pode gostar</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {relacionados.map(filmeRelacionado => (
                                <CardFilme key={filmeRelacionado.id} filme={filmeRelacionado} onClick={() => navegar('detalhes', { idFilme: filmeRelacionado.id })} />
                            ))}
                        </div>
                    </div>
                )
            )}

            {/* Modal do Trailer */}
            {trailerAberto && filme.urlVideo && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setTrailerAberto(false)}
                >
                    <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                         <Player 
                            src={filme.urlVideo}
                            poster={filme.imagemFundo}
                            titulo={`Trailer: ${filme.titulo}`}
                         />
                         <button 
                            onClick={() => setTrailerAberto(false)} 
                            className="absolute -top-3 -right-3 w-10 h-10 bg-brand-background rounded-full text-white text-xl flex items-center justify-center border-2 border-brand-accent hover:bg-brand-accent transition-colors"
                            aria-label="Fechar trailer"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}
            
             {/* Modal de Download */}
            {modalDownloadAberto && (
                <ModalDownload filme={filme} aoFechar={() => setModalDownloadAberto(false)} />
            )}

        </div>
    );
};

export default Detalhes;