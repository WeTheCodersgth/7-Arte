import React, { useState, useEffect } from 'react';
import { buscarConteudoPorId, buscarConteudoRelacionado } from '../../api/conteudoAPI';
import { Conteudo, Episodio } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';
import Player from '../../components/usuarios/player';
import Comentario from '../../components/usuarios/comentario';
import Avaliacoes from '../../components/usuarios/avaliacoes';
import Download from '../../components/usuarios/download';
import ModalDownload from '../../components/usuarios/downloadModal';

interface PropsAssistir extends PropsPaginaAutenticada {
    idFilme?: number;
}

// Componente de card de filme/série para a seção "Você também pode gostar".
const CardFilme = ({ filme, onClick }: { filme: Conteudo, onClick: () => void }) => (
    <div onClick={onClick} className="group/card relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-accent/30 cursor-pointer">
        <img src={filme.poster} alt={filme.titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 p-3 w-full opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform group-hover/card:translate-y-0 translate-y-4">
            <h3 className="text-white font-bold text-sm truncate">{filme.titulo}</h3>
        </div>
    </div>
);

// Componente de esqueleto de carregamento para a página assistir.
const EsqueletoCarregamento = () => (
    <div className="animate-pulse container mx-auto px-6 lg:px-16 py-8">
        <div className="aspect-video bg-gray-800/50 rounded-lg"></div>
        <div className="h-8 bg-gray-700/80 rounded w-3/4 mt-6 mb-4"></div>
        <div className="h-20 bg-gray-700/80 rounded w-full"></div>
    </div>
);

const Assistir = ({ idFilme, navegar, usuarioAtual, abrirModalAutenticacao }: PropsAssistir) => {
    const [conteudo, setConteudo] = useState<Conteudo | null>(null);
    const [relacionados, setRelacionados] = useState<Conteudo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [episodioAtual, setEpisodioAtual] = useState<Episodio | null>(null);
    const [proximoEpisodio, setProximoEpisodio] = useState<Episodio | null>(null);
    const [abaAtiva, setAbaAtiva] = useState<'comments' | 'reviews'>('comments');
    const [modalDownloadAberto, setModalDownloadAberto] = useState(false);


    // Efeito para carregar os dados do conteúdo a ser assistido.
    useEffect(() => {
        if (!idFilme) return;

        setCarregando(true);
        const timer = setTimeout(() => {
            const conteudoEncontrado = buscarConteudoPorId(idFilme);
            if (conteudoEncontrado) {
                setConteudo(conteudoEncontrado);
                setRelacionados(buscarConteudoRelacionado(idFilme));
                // Se for uma série, define o primeiro episódio como o atual e o segundo como o próximo.
                if (conteudoEncontrado.tipo === 'series' && conteudoEncontrado.temporadas && conteudoEncontrado.temporadas[0]?.episodios) {
                    const primeiroEpisodio = conteudoEncontrado.temporadas[0].episodios[0];
                    setEpisodioAtual(primeiroEpisodio);
                    const segundoEpisodio = conteudoEncontrado.temporadas[0].episodios[1];
                    setProximoEpisodio(segundoEpisodio || null);
                }
            }
            setCarregando(false);
        }, 1000); // Simula carregamento de rede.

        return () => clearTimeout(timer);
    }, [idFilme]);
    
    // Lida com a transição para o próximo episódio quando o atual termina.

    const lidarComProximoEpisodio = () => {
        if (conteudo?.tipo !== 'series' || !proximoEpisodio) return;

        setEpisodioAtual(proximoEpisodio);

        // Encontra e define o novo "próximo episódio" na lista.
        const temporadaAtual = conteudo.temporadas?.[0];
        if (temporadaAtual) {
            const indiceProximoEp = temporadaAtual.episodios.findIndex(ep => ep.numeroEpisodio === proximoEpisodio.numeroEpisodio);
            const novoProximoEpisodio = temporadaAtual.episodios[indiceProximoEp + 1];
            setProximoEpisodio(novoProximoEpisodio || null);
        }
    };

    //  Simula a funcionalidade de compartilhar.
    const lidarComCompartilhamento = () => {
        // Lógica de compartilhamento pode ser mais complexa
        alert('Link copiado para a área de transferência!');
    };

    if (carregando) {
        return <EsqueletoCarregamento />;
    }

    if (!conteudo) {
        return (
            <div className="flex items-center justify-center h-full -mt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-brand-accent mb-4">404</h1>
                    <p className="text-brand-secondary">Conteúdo não encontrado.</p>
                    <button onClick={() => navegar('home')} className="mt-6 bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors duration-300">
                        Voltar para o Início
                    </button>
                </div>
            </div>
        );
    }
    
    // Determina a URL e o título do vídeo a ser passado para o player.
    const urlVideo = conteudo.urlVideo; // Para séries, a URL do vídeo poderia vir do `episodioAtual`.
    const tituloVideo = conteudo.tipo === 'series' && episodioAtual ? `${conteudo.titulo} - T1:E${episodioAtual.numeroEpisodio} ${episodioAtual.titulo}` : conteudo.titulo;


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8">
            {urlVideo && (
                 <Player 
                    src={urlVideo}
                    poster={conteudo.imagemFundo}
                    titulo={tituloVideo}
                    aoTerminar={lidarComProximoEpisodio}
                />
            )}
           
            <div className="mt-8">
                <h1 className="text-3xl md:text-4xl font-black font-display text-white drop-shadow-lg mb-2">{conteudo.titulo}</h1>
                <p className="text-brand-secondary text-base leading-relaxed max-w-4xl">{episodioAtual ? episodioAtual.descricao : conteudo.descricao}</p>
            </div>
            
            {/* Botões de Ação */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Download aoClicar={() => setModalDownloadAberto(true)} />
                <button onClick={lidarComCompartilhamento} className="bg-gray-700 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 active:scale-95 transform transition-all duration-300 w-full sm:w-auto flex items-center justify-center">
                    <i className="fas fa-share-alt mr-2"></i>
                    <span>Compartilhar</span>
                </button>
            </div>


            {/* Seção "A Seguir" para séries */}
            {conteudo.tipo === 'series' && proximoEpisodio && (
                <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="text-lg font-bold text-brand-secondary mb-2">A seguir</h3>
                    <div 
                        className="flex items-center gap-4 cursor-pointer group/next"
                        onClick={lidarComProximoEpisodio}
                    >
                        <div className="w-1/3 sm:w-1/4 md:w-1/6">
                            <img src={proximoEpisodio.miniatura} alt={proximoEpisodio.titulo} className="w-full aspect-video rounded-md object-cover" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white group-hover/next:text-brand-accent transition-colors">{proximoEpisodio.numeroEpisodio}. {proximoEpisodio.titulo}</h4>
                            <p className="text-sm text-brand-secondary mt-1 hidden sm:block">{proximoEpisodio.descricao}</p>
                        </div>
                        <div className="text-white text-3xl group-hover/next:text-brand-accent transition-colors">
                            <i className="fas fa-play-circle"></i>
                        </div>
                    </div>
                </div>
            )}


            {/* Lista de Episódios para séries */}
            {conteudo.tipo === 'series' && conteudo.temporadas && conteudo.temporadas.length > 0 && (
                <div className="mt-12">
                     <h2 className="text-2xl font-bold text-brand-primary mb-4">Episódios</h2>
                     <div className="bg-gray-800/50 rounded-lg p-4 max-h-96 overflow-y-auto custom-scrollbar">
                        {conteudo.temporadas[0].episodios.map(episodio => (
                            <div 
                                key={episodio.numeroEpisodio} 
                                className={`flex items-start gap-4 p-2 rounded-md cursor-pointer transition-colors ${episodioAtual?.numeroEpisodio === episodio.numeroEpisodio ? 'bg-brand-accent/30' : 'hover:bg-gray-900/40'}`}
                                onClick={() => setEpisodioAtual(episodio)}
                            >
                                <span className="text-lg font-bold text-brand-secondary w-8 text-center">{episodio.numeroEpisodio}</span>
                                <div className="w-1/3 sm:w-1/4 md:w-1/6">
                                    <img src={episodio.miniatura} alt={episodio.titulo} className="w-full aspect-video rounded-md object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{episodio.titulo} <span className="text-sm font-normal text-brand-secondary ml-2">{episodio.duracao}</span></h4>
                                    <p className="text-sm text-brand-secondary mt-1 hidden sm:block">{episodio.descricao}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
            
            {/* Abas de Comentários e Avaliações */}
            <div className="mt-16">
                 <div className="border-b border-gray-700/50 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setAbaAtiva('comments')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors duration-300 ${
                                abaAtiva === 'comments'
                                    ? 'border-brand-accent text-brand-accent'
                                    : 'border-transparent text-brand-secondary hover:text-brand-primary hover:border-gray-500'
                            }`}
                        >
                            Comentários
                        </button>
                        <button
                             onClick={() => setAbaAtiva('reviews')}
                             className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors duration-300 ${
                                abaAtiva === 'reviews'
                                    ? 'border-brand-accent text-brand-accent'
                                    : 'border-transparent text-brand-secondary hover:text-brand-primary hover:border-gray-500'
                            }`}
                        >
                            Avaliações
                        </button>
                    </nav>
                </div>
                <div>
                    {abaAtiva === 'comments' && <Comentario usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} />}
                    {abaAtiva === 'reviews' && <Avaliacoes usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} />}
                </div>
            </div>


            {/* Conteúdo Relacionado */}
            {relacionados.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-brand-primary mb-4">Você também pode gostar</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {relacionados.map(filmeRelacionado => (
                            <CardFilme key={filmeRelacionado.id} filme={filmeRelacionado} onClick={() => navegar('detalhes', { idFilme: filmeRelacionado.id })} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Modal de Download */}
            {modalDownloadAberto && conteudo && (
                <ModalDownload filme={conteudo} aoFechar={() => setModalDownloadAberto(false)} />
            )}
        </div>
    )
};

export default Assistir;