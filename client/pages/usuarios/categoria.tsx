import React, { useState, useEffect } from 'react';
import { buscarConteudoPorCategoria, buscarConteudoPorNomeGenero, buscarMetadadosCategoria } from '../../api/categoriasAPI';
import { getMinhaLista } from '../../api/usuarioAPI';
import { Conteudo } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';

interface PropsPaginaCategoria extends PropsPaginaAutenticada {
    tipo?: 'genre' | 'collection';
    valor?: string;
    titulo?: string;
}

// Componente de card de filme/série reutilizado.
const CardFilme = ({ filme, onClick, usuarioAtual, abrirModalAutenticacao, navegar, aoAtualizarMinhaLista }: { filme: Conteudo; onClick: () => void; usuarioAtual: PropsPaginaAutenticada['usuarioAtual']; abrirModalAutenticacao: () => void; navegar: PropsPaginaAutenticada['navegar']; aoAtualizarMinhaLista: PropsPaginaAutenticada['aoAtualizarMinhaLista']; }) => {
    const filmeEstaNaLista = usuarioAtual?.minhaLista.includes(filme.id) ?? false;
    
    const lidarComAdicionarALista = (e: React.MouseEvent) => {
        e.stopPropagation();
        aoAtualizarMinhaLista(filme.id);
    };
    
    const lidarComPlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(filme.urlVideo) {
            navegar('assistir', { idFilme: filme.id });
        } else {
            alert('Vídeo indisponível no momento.');
        }
    };

    return (
        <div onClick={onClick} className="group/card relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-accent/30 cursor-pointer">
            <img src={filme.poster} alt={filme.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-3 w-full opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform group-hover/card:translate-y-0 translate-y-4">
                <h3 className="text-white font-bold text-sm truncate">{filme.titulo}</h3>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                        <span className="text-white text-xs ml-1">{filme.avaliacao}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-white text-lg">
                        <i onClick={lidarComPlay} className="fas fa-play-circle hover:text-brand-accent transition-colors duration-200 cursor-pointer active:scale-90" aria-label="Play"></i>
                        <i 
                            onClick={lidarComAdicionarALista} 
                            className={`fas ${filmeEstaNaLista ? 'fa-check-circle text-green-400 hover:text-green-500' : 'fa-plus-circle hover:text-brand-accent'} transition-colors duration-200 cursor-pointer active:scale-90`} 
                            aria-label={filmeEstaNaLista ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
                        ></i>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-brand-accent rounded-lg transition-all duration-300 pointer-events-none"></div>
        </div>
    );
};

// Componente de esqueleto de carregamento.
const EsqueletoCard = () => (
    <div className="w-full aspect-[2/3] rounded-lg bg-gray-800/50 skeleton-pulse"></div>
);

const PaginaCategoria = ({ tipo = 'collection', valor = 'filmes', titulo = 'Conteúdo', navegar, usuarioAtual, abrirModalAutenticacao, aoAtualizarMinhaLista }: PropsPaginaCategoria) => {
    const [filmes, setFilmes] = useState<Conteudo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [tituloPagina, setTituloPagina] = useState(titulo);
    const [imagemHeroi, setImagemHeroi] = useState<string | null>(null);
    const [descricaoHeroi, setDescricaoHeroi] = useState<string | null>(null);

    // Efeito para buscar os dados da categoria quando os parâmetros `tipo` ou `valor` mudam.
    useEffect(() => {
        setCarregando(true);
        
        // Simula um tempo de carregamento da rede.
        const timer = setTimeout(() => {
            let filmesBuscados: Conteudo[] = [];
            if (tipo && valor) {
                // Busca os metadados (título, descrição, imagem) para a categoria.
                const metadados = buscarMetadadosCategoria(tipo, valor);
                if (metadados) {
                    setTituloPagina(metadados.titulo);
                    setImagemHeroi(metadados.imagemHeroi);
                    setDescricaoHeroi(metadados.descricao);
                } else {
                    setTituloPagina(titulo); // Usa o título passado como prop como fallback.
                }

                // Busca os filmes/séries com base no tipo de categoria.
                if (tipo === 'genre') {
                    filmesBuscados = buscarConteudoPorNomeGenero(valor);
                } else if (tipo === 'collection') {
                    if (valor === 'minha-lista') {
                        // Se não estiver logado, a lista estará vazia
                        if (usuarioAtual) {
                            filmesBuscados = getMinhaLista(usuarioAtual.id);
                        }
                    } else {
                        filmesBuscados = buscarConteudoPorCategoria(valor);
                    }
                }
            }
            
            setFilmes(filmesBuscados);
            setCarregando(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [tipo, valor, titulo, usuarioAtual]);

    return (
        <div className="min-h-screen">
            {/* Seção Hero*/}
            {!carregando && imagemHeroi && (
                <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-center overflow-hidden">
                    <div
                        className="hero-bg-image absolute inset-0 bg-cover bg-center transition-all duration-500 scale-105"
                        style={{backgroundImage: `url(${imagemHeroi})`}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/80 to-transparent"></div>
                    <div className="relative z-10 px-4 sm:px-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display text-white drop-shadow-lg mb-4">{tituloPagina}</h1>
                        {descricaoHeroi && (
                            <p className="max-w-3xl mx-auto text-brand-secondary text-base md:text-lg drop-shadow-md">{descricaoHeroi}</p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Grade de Conteúdo */}
            <div className={`container mx-auto px-4 sm:px-6 lg:px-16 pb-16 ${carregando || !imagemHeroi ? 'mt-8' : '-mt-12 md:-mt-20'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative z-20">
                    {carregando ? (
                        Array.from({ length: 18 }).map((_, i) => <EsqueletoCard key={i} />)
                    ) : (
                        filmes.map(filme => (
                            <CardFilme 
                                key={`${filme.id}-${filme.titulo}`} 
                                filme={filme} 
                                onClick={() => navegar('detalhes', { idFilme: filme.id })}
                                usuarioAtual={usuarioAtual}
                                abrirModalAutenticacao={abrirModalAutenticacao}
                                navegar={navegar}
                                aoAtualizarMinhaLista={aoAtualizarMinhaLista}
                            />
                        ))
                    )}
                </div>
                 { !carregando && filmes.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <p className="text-brand-secondary text-lg">
                           {valor === 'minha-lista' ? 'Sua lista está vazia. Adicione filmes e séries para vê-los aqui.' : 'Nenhum conteúdo encontrado para esta categoria.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaginaCategoria;