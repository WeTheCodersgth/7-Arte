import React, { useState, useEffect } from 'react';
import { buscarDadosAvaliacaoParaConteudo } from '../../api/avaliacoesAPI';
import { DadosAvaliacao } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';

interface PropsAvaliacoes {
    usuarioAtual: PropsPaginaAutenticada['usuarioAtual'];
    abrirModalAutenticacao: () => void;
}

// Componente para exibir o esqueleto de carregamento
const EsqueletoAvaliacoes = () => (
    <div className="bg-gray-800/50 rounded-lg p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 text-center md:text-left md:border-r md:border-gray-700/50 md:pr-8">
                <div className="h-4 bg-gray-700 rounded w-24 mx-auto md:mx-0"></div>
                <div className="h-12 bg-gray-700 rounded w-20 my-2 mx-auto md:mx-0"></div>
                <div className="h-5 bg-gray-700 rounded w-28 mx-auto md:mx-0"></div>
                <div className="h-3 bg-gray-700 rounded w-24 mt-2 mx-auto md:mx-0"></div>
            </div>
            <div className="flex-grow">
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-4 bg-gray-700 rounded w-8"></div>
                            <div className="h-2.5 bg-gray-700 rounded-full w-full"></div>
                            <div className="h-4 bg-gray-700 rounded w-10"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-6">
             <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
             <div className="h-20 bg-gray-700/80 rounded-lg"></div>
        </div>
    </div>
);


const AvaliacaoEstrelas = ({ nota, totalEstrelas = 5 }: { nota: number, totalEstrelas?: number }) => {
    return (
        <div className="flex items-center">
            {[...Array(totalEstrelas)].map((_, index) => {
                const classeEstrela = index < Math.round(nota) ? "fas fa-star text-yellow-400" : "far fa-star text-gray-500";
                return <i key={index} className={classeEstrela}></i>;
            })}
        </div>
    );
};

const Avaliacoes = ({ usuarioAtual, abrirModalAutenticacao }: PropsAvaliacoes) => {
    const [dadosAvaliacoes, setDadosAvaliacoes] = useState<DadosAvaliacao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [avaliacaoUsuario, setAvaliacaoUsuario] = useState(0);
    const [avaliacaoHover, setAvaliacaoHover] = useState(0);
    
    const estaLogado = !!usuarioAtual;

    // Efeito para buscar os dados das avaliações na montagem do componente.
    useEffect(() => {
        setCarregando(true);
        // Simula uma chamada de API.
        setTimeout(() => {
            // Fora da simulação, passaría-se o ID do filme/série.
            setDadosAvaliacoes(buscarDadosAvaliacaoParaConteudo(1)); 
            setCarregando(false);
        }, 900);
    }, []);

    if (carregando || !dadosAvaliacoes) {
        return <EsqueletoAvaliacoes />;
    }

    return (
        <div className="text-brand-primary">
            <div className="bg-gray-800/50 rounded-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sumário */}
                    <div className="flex-shrink-0 text-center md:text-left md:border-r md:border-gray-700/50 md:pr-8">
                        <p className="text-brand-secondary text-sm font-bold">NOTA MÉDIA</p>
                        <p className="text-5xl font-black text-white my-2">{dadosAvaliacoes.media.toFixed(1)}</p>
                        <AvaliacaoEstrelas nota={dadosAvaliacoes.media} />
                        <p className="text-brand-secondary text-xs mt-2">{dadosAvaliacoes.total.toLocaleString('pt-BR')} avaliações</p>
                    </div>
                    
                    {/* Distribuição */}
                    <div className="flex-grow">
                         <div className="space-y-2">
                            {dadosAvaliacoes.distribuicao.map(({ estrelas, porcentagem }) => (
                                <div key={estrelas} className="flex items-center gap-3 text-sm">
                                    <span className="text-brand-secondary font-bold">{estrelas} <i className="fas fa-star text-xs"></i></span>
                                    <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                                        <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${porcentagem}%` }}></div>
                                    </div>
                                    <span className="text-brand-secondary w-10 text-right">{porcentagem}%</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Avaliação do Usuário */}
                <div className="border-t border-gray-700/50 mt-8 pt-6">
                    <h3 className="font-bold text-lg text-white mb-4">Sua Avaliação</h3>
                    {estaLogado ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div 
                                className="flex items-center space-x-1 text-3xl"
                                onMouseLeave={() => setAvaliacaoHover(0)}
                            >
                                {[...Array(5)].map((_, index) => {
                                    const valorEstrela = index + 1;
                                    return (
                                        <i
                                            key={valorEstrela}
                                            className={`cursor-pointer transition-colors duration-200 ${
                                                valorEstrela <= (avaliacaoHover || avaliacaoUsuario) ? 'fas fa-star text-yellow-400 scale-110' : 'far fa-star text-gray-500'
                                            }`}
                                            onClick={() => setAvaliacaoUsuario(valorEstrela)}
                                            onMouseEnter={() => setAvaliacaoHover(valorEstrela)}
                                        />
                                    );
                                })}
                            </div>
                            <button
                                disabled={avaliacaoUsuario === 0}
                                className="bg-brand-accent text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-sm disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {avaliacaoUsuario > 0 ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                            </button>
                        </div>
                    ) : (
                         <div 
                            className="relative p-8 bg-gray-900/70 rounded-lg flex items-center justify-center text-center cursor-pointer group hover:bg-gray-900 transition-colors"
                            onClick={abrirModalAutenticacao}
                        >
                            <div className="relative">
                                <i className="fas fa-lock text-3xl text-brand-secondary mb-3"></i>
                                <p className="font-bold text-white">Faça login para avaliar</p>
                                <p className="text-sm text-brand-secondary">Sua opinião é importante para a comunidade.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Avaliacoes;