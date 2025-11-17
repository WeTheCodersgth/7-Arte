import React, { useState, useMemo, useEffect } from 'react';
import { buscarComentariosParaConteudo } from '../../api/comentariosAPI';
import { Comentario as TipoComentario } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';

interface PropsComentario {
    usuarioAtual: PropsPaginaAutenticada['usuarioAtual'];
    abrirModalAutenticacao: () => void;
}

// Formata uma data para uma string de tempo relativo (ex: "há 2 horas").

const formatarTempoAtras = (data: Date): string => {
    const segundos = Math.floor((new Date().getTime() - data.getTime()) / 1000);
    
    let intervalo = segundos / 31536000;
    if (intervalo >= 1) {
        const n = Math.floor(intervalo);
        return `há ${n} ano${n > 1 ? 's' : ''}`;
    }
    
    intervalo = segundos / 2592000;
    if (intervalo >= 1) {
        const n = Math.floor(intervalo);
        return `há ${n} ${n > 1 ? 'meses' : 'mês'}`;
    }

    intervalo = segundos / 86400;
    if (intervalo >= 1) {
        const n = Math.floor(intervalo);
        return `há ${n} dia${n > 1 ? 's' : ''}`;
    }

    intervalo = segundos / 3600;
    if (intervalo >= 1) {
        const n = Math.floor(intervalo);
        return `há ${n} hora${n > 1 ? 's' : ''}`;
    }

    intervalo = segundos / 60;
    if (intervalo >= 1) {
        const n = Math.floor(intervalo);
        return `há ${n} minuto${n > 1 ? 's' : ''}`;
    }

    return "agora mesmo";
};

// Componente para exibir o esqueleto de carregamento de um comentário.
const EsqueletoComentario = () => (
    <div className="flex items-start gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-700/80 mt-1"></div>
        <div className="flex-1">
            <div className="bg-gray-800/60 rounded-lg px-4 py-2">
                <div className="flex items-baseline gap-2">
                    <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-full mt-2"></div>
                 <div className="h-4 bg-gray-700 rounded w-2/3 mt-1"></div>
            </div>
            <div className="flex items-center gap-4 mt-2 px-2">
                 <div className="h-3 bg-gray-700 rounded w-8"></div>
                 <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
        </div>
    </div>
);


const Comentario = ({ usuarioAtual, abrirModalAutenticacao }: PropsComentario) => {
    const [comentarios, setComentarios] = useState<TipoComentario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [novoComentario, setNovoComentario] = useState('');
    const [ordenarPor, setOrdenarPor] = useState<'latest' | 'popular'>('latest');
    const [idRespostaAtiva, setIdRespostaAtiva] = useState<number | null>(null);
    const [textoResposta, setTextoResposta] = useState('');

    const estaLogado = !!usuarioAtual;

    // Efeito para buscar os comentários na montagem do componente.
    useEffect(() => {
        setCarregando(true);
        // Simula uma chamada de API.
        setTimeout(() => {
            // Fora da Simulação, passaría-se o ID do filme/série.
            setComentarios(buscarComentariosParaConteudo(1)); 
            setCarregando(false);
        }, 800);
    }, []);

    //  Lida com interações que exigem login (curtir, responder).

    const lidarComInteracaoProtegida = (e: React.MouseEvent, acao?: () => void) => {
        if (!estaLogado) {
            e.preventDefault();
            abrirModalAutenticacao();
        } else if (acao) {
            acao();
        }
    };

    //  Incrementa o número de curtidas de um comentário, de forma recursiva.

    const lidarComCurtida = (idComentario: number) => {
        const atualizarCurtidas = (listaComentarios: TipoComentario[]): TipoComentario[] => {
            return listaComentarios.map(comentario => {
                if (comentario.id === idComentario) {
                    return { ...comentario, curtidas: comentario.curtidas + 1 };
                }
                // Busca recursivamente nas respostas
                return { ...comentario, respostas: atualizarCurtidas(comentario.respostas) };
            });
        };
        setComentarios(atualizarCurtidas(comentarios));
    };

    //  Submete uma nova resposta a um comentário pai.

    const lidarComEnvioResposta = (idComentarioPai: number) => {
        if (!textoResposta.trim() || !usuarioAtual) return;
        
        const novaResposta: TipoComentario = {
            id: Date.now(),
            usuario: usuarioAtual.nome,
            avatar: `https://i.pravatar.cc/150?u=${usuarioAtual.id}`,
            texto: textoResposta,
            dataHora: new Date(),
            curtidas: 0,
            respostas: []
        };

        // Função recursiva para adicionar a resposta ao comentário correto.
        const adicionarResposta = (listaComentarios: TipoComentario[]): TipoComentario[] => {
             return listaComentarios.map(comentario => {
                if (comentario.id === idComentarioPai) {
                    return { ...comentario, respostas: [novaResposta, ...comentario.respostas] };
                }
                return { ...comentario, respostas: adicionarResposta(comentario.respostas) };
            });
        };

        setComentarios(adicionarResposta(comentarios));
        setIdRespostaAtiva(null);
        setTextoResposta('');
    };

    //  Submete um novo comentário principal.

    const lidarComEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        if (novoComentario.trim() && usuarioAtual) {
            const objetoNovoComentario: TipoComentario = {
                id: Date.now(),
                usuario: usuarioAtual.nome,
                avatar: `https://i.pravatar.cc/150?u=${usuarioAtual.id}`,
                texto: novoComentario,
                dataHora: new Date(),
                curtidas: 0,
                respostas: []
            };
            setComentarios([objetoNovoComentario, ...comentarios]);
            setNovoComentario('');
        }
    };

    // Ordena os comentários com base na seleção do usuário (Mais Recentes ou Mais Populares).
    const comentariosOrdenados = useMemo(() => {
        const ordenado = [...comentarios];
        if (ordenarPor === 'latest') {
            ordenado.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
        } else if (ordenarPor === 'popular') {
            ordenado.sort((a, b) => b.curtidas - a.curtidas);
        }
        return ordenado;
    }, [comentarios, ordenarPor]);

    // Calcula o número total de comentários, incluindo respostas, de forma recursiva.
    const totalComentarios = useMemo(() => {
        let contador = 0;
        const contarComentarios = (listaComentarios: TipoComentario[]) => {
            listaComentarios.forEach(comentario => {
                contador++;
                if (comentario.respostas.length > 0) {
                    contarComentarios(comentario.respostas);
                }
            });
        };
        contarComentarios(comentarios);
        return contador;
    }, [comentarios]);


    // Componente para renderizar um único item de comentário (e suas respostas recursivamente).
    const ItemComentario = ({ comentario }: { comentario: TipoComentario }) => (
        <div className="flex items-start gap-4">
            <img src={comentario.avatar} alt={comentario.usuario} className="w-10 h-10 rounded-full object-cover mt-1" />
            <div className="flex-1">
                <div className="bg-gray-800/60 rounded-lg px-4 py-2">
                    <div className="flex items-baseline gap-2">
                        <p className="font-bold text-white text-sm">{comentario.usuario}</p>
                        <p className="text-xs text-gray-400">{formatarTempoAtras(comentario.dataHora)}</p>
                    </div>
                    <p className="text-brand-secondary mt-1 text-sm">{comentario.texto}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 px-2 text-xs text-gray-400">
                    <button onClick={(e) => lidarComInteracaoProtegida(e, () => lidarComCurtida(comentario.id))} className="flex items-center gap-1 hover:text-brand-accent transition-colors">
                        <i className="fas fa-heart"></i>
                        <span>{comentario.curtidas}</span>
                    </button>
                    <button onClick={(e) => lidarComInteracaoProtegida(e, () => setIdRespostaAtiva(idRespostaAtiva === comentario.id ? null : comentario.id))} className="hover:text-brand-accent transition-colors">
                        Responder
                    </button>
                </div>
                {idRespostaAtiva === comentario.id && (
                     <form onSubmit={(e) => { e.preventDefault(); lidarComEnvioResposta(comentario.id); }} className="flex items-start gap-2 mt-3">
                        <img src={`https://i.pravatar.cc/150?u=${usuarioAtual?.id}`} alt="Seu avatar" className="w-8 h-8 rounded-full object-cover mt-1" />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={textoResposta}
                                onChange={(e) => setTextoResposta(e.target.value)}
                                className="w-full bg-gray-900/70 rounded-full py-1.5 px-4 text-brand-secondary placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors text-sm"
                                placeholder="Escreva uma resposta..."
                                autoFocus
                            />
                        </div>
                    </form>
                )}
                 {comentario.respostas && comentario.respostas.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-700/50 space-y-4">
                        {comentario.respostas.map(resposta => <ItemComentario key={resposta.id} comentario={resposta} />)}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-primary">{carregando ? '...' : totalComentarios} Comentários</h2>
                 <div className="relative">
                    <select
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value as 'latest' | 'popular')}
                        className="bg-gray-800/50 text-brand-secondary text-sm font-bold rounded-full appearance-none py-1.5 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-accent cursor-pointer"
                    >
                        <option value="latest">Mais Recentes</option>
                        <option value="popular">Mais Populares</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-secondary pointer-events-none"></i>
                </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
                 {estaLogado && usuarioAtual ? (
                    <form onSubmit={lidarComEnvio} className="flex items-start gap-4 mb-8">
                        <img src={`https://i.pravatar.cc/150?u=${usuarioAtual.id}`} alt="Seu avatar" className="w-10 h-10 rounded-full object-cover mt-1" />
                        <div className="flex-1">
                            <textarea
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                                className="w-full bg-gray-900/70 rounded-md p-3 text-brand-secondary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
                                rows={3}
                                placeholder="Participe da discussão..."
                            ></textarea>
                            <div className="flex justify-end mt-3">
                                <button 
                                    type="submit"
                                    disabled={!novoComentario.trim()}
                                    className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-sm disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    Comentar
                                </button>
                            </div>
                        </div>
                    </form>
                 ) : (
                    <div className="mb-8">
                        <div 
                            className="bg-gray-900/70 rounded-md p-3 text-gray-500 cursor-pointer hover:bg-gray-900 transition-colors text-center"
                            onClick={abrirModalAutenticacao}
                        >
                            Faça login para participar da discussão...
                        </div>
                    </div>
                 )}

                <div className="space-y-6">
                    {carregando ? (
                        <>
                           <EsqueletoComentario />
                           <EsqueletoComentario />
                           <EsqueletoComentario />
                        </>
                    ) : (
                        comentariosOrdenados.map(comentario => (
                           <ItemComentario key={comentario.id} comentario={comentario} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comentario;