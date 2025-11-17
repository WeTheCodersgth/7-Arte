import React, { useState, useEffect } from 'react';
import {
    buscarFilmesPopulares,
    buscarLancamentos,
    buscarClassicosCinema,
    buscarSeriesParaMaratonar,
} from '../../api/conteudoAPI';
import { buscarGeneros } from '../../api/generosAPI';
import { Conteudo, Genero } from '../../banco/types';
import { PropsPaginaAutenticada } from '../..';

interface PropsHome extends PropsPaginaAutenticada {}

// Componente de card de filme/série com interações de hover e clique.
const CardFilme = ({ filme, onClick, usuarioAtual, abrirModalAutenticacao, navegar, aoAtualizarMinhaLista }: { filme: Conteudo; onClick: () => void; usuarioAtual: PropsPaginaAutenticada['usuarioAtual']; abrirModalAutenticacao: () => void; navegar: PropsPaginaAutenticada['navegar']; aoAtualizarMinhaLista: PropsPaginaAutenticada['aoAtualizarMinhaLista']; }) => {
    const filmeEstaNaLista = usuarioAtual?.minhaLista.includes(filme.id) ?? false;

    const lidarComAdicionarALista = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o clique no ícone acione o clique do card.
        aoAtualizarMinhaLista(filme.id);
    };
    
    const lidarComPlay = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o clique no ícone acione o clique do card.
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

// Componente de esqueleto de carregamento para o card de filme.
const EsqueletoCard = () => (
    <div className="w-full aspect-[2/3] rounded-lg bg-gray-800/50 skeleton-pulse"></div>
);

// Componente de seção que exibe uma grade de filmes/séries.
const CarrosselFilmes = ({ titulo, filmes, mostrarVerMais = false, carregando = false, navegar, chaveCategoria, usuarioAtual, abrirModalAutenticacao, aoAtualizarMinhaLista }: { titulo: string; filmes: Conteudo[]; mostrarVerMais?: boolean; carregando?: boolean; navegar: PropsHome['navegar']; chaveCategoria: string; usuarioAtual: PropsPaginaAutenticada['usuarioAtual']; abrirModalAutenticacao: () => void; aoAtualizarMinhaLista: PropsPaginaAutenticada['aoAtualizarMinhaLista']; }) => {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">{titulo}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {carregando ? (
                    Array.from({ length: 6 }).map((_, i) => <EsqueletoCard key={i} />)
                ) : (
                    filmes.map(filme => (
                        <CardFilme 
                            key={filme.id} 
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
            {mostrarVerMais && !carregando && (
                 <div className="flex justify-center mt-6">
                    <button onClick={() => navegar('categorias', { tipo: 'collection', valor: chaveCategoria, titulo: titulo })} className="bg-gray-800 bg-opacity-50 text-brand-secondary font-bold py-2 px-8 rounded-full hover:bg-brand-accent hover:text-white transform transition-all duration-300 shadow-lg hover:shadow-brand-accent/30 text-sm">
                        Ver Mais
                    </button>
                </div>
            )}
        </section>
    );
};

// Componente que exibe uma grade de gêneros navegáveis.
const GradeGeneros = ({ generos, carregando = false, navegar }: { generos: Genero[], carregando?: boolean, navegar: PropsHome['navegar'] }) => (
    <section className="mb-16">
        <h2 className="text-2xl font-bold text-brand-primary mb-4">Navegar por Gênero</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {carregando ? (
                Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-lg bg-gray-800/50 skeleton-pulse"></div>)
            ) : (
                generos.map((genero) => (
                    <div key={genero.nome} onClick={() => navegar('categorias', { tipo: 'genre', valor: genero.nome, titulo: `Gênero: ${genero.nome}` })} className="group relative rounded-lg overflow-hidden h-28 cursor-pointer shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-accent/30">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-400 group-hover:scale-110" style={{ backgroundImage: `url(${genero.imagem})` }}></div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-300"></div>
                        <div className="relative h-full flex items-center justify-center">
                            <h3 className="text-white font-bold text-lg drop-shadow-md text-center px-2">{genero.nome}</h3>
                        </div>
                    </div>
                ))
            )}
        </div>
    </section>
);


const Home = ({ navegar, usuarioAtual, abrirModalAutenticacao, aoAtualizarMinhaLista }: PropsHome) => {
    const [filmesPopulares, setFilmesPopulares] = useState<Conteudo[]>([]);
    const [lancamentos, setLancamentos] = useState<Conteudo[]>([]);
    const [classicosCinema, setClassicosCinema] = useState<Conteudo[]>([]);
    const [seriesParaMaratonar, setSeriesParaMaratonar] = useState<Conteudo[]>([]);
    const [generos, setGeneros] = useState<Genero[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [indiceHeroiAtual, setIndiceHeroiAtual] = useState(0);

    // Efeito para buscar todos os dados da página inicial na montagem.
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilmesPopulares(buscarFilmesPopulares());
            setLancamentos(buscarLancamentos());
            setClassicosCinema(buscarClassicosCinema());
            setSeriesParaMaratonar(buscarSeriesParaMaratonar());
            setGeneros(buscarGeneros());
            setCarregando(false);
        }, 1500); // Simula o tempo de carregamento da rede.

        return () => clearTimeout(timer);
    }, []);

    // Efeito para controlar a troca automática do carrossel da seção Hero.
    useEffect(() => {
        if (filmesPopulares.length > 0) {
            const interval = setInterval(() => {
                setIndiceHeroiAtual(indiceAnterior => (indiceAnterior + 1) % filmesPopulares.length);
            }, 7000); // Troca a cada 7 segundos.
            return () => clearInterval(interval);
        }
    }, [filmesPopulares]);
    
    const filmeHeroi = filmesPopulares[indiceHeroiAtual];

  return (
    <div className="text-brand-primary">
      {/* Seção Hero */}
      <div className="relative h-screen -mt-20 flex items-center justify-center text-center">
        {filmesPopulares.map((filme, index) => (
             <div
                key={filme.id}
                className={`hero-bg-image absolute inset-0 bg-cover bg-center ${index === indiceHeroiAtual ? 'opacity-100' : 'opacity-0'}`}
                style={{backgroundImage: `url(${filme.imagemFundo})`}}
            />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-background via-brand-background/70 to-transparent smoky-gradient"></div>
        <div className="relative z-10 px-4">
          {filmeHeroi && (
            <div key={filmeHeroi.id} className="hero-content">
                <h2 className="text-5xl md:text-7xl font-black font-display text-white drop-shadow-lg mb-4 hero-fade-enter hero-fade-enter-active">{filmeHeroi.titulo.toUpperCase()}</h2>
                <p className="max-w-2xl mx-auto text-brand-secondary mb-8 drop-shadow-md hero-fade-enter hero-fade-enter-active" style={{ transitionDelay: '150ms' }}>
                    {filmeHeroi.descricao}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-enter hero-fade-enter-active" style={{ transitionDelay: '300ms' }}>
                    {filmeHeroi.urlVideo && (
                        <button 
                            onClick={() => navegar('assistir', { idFilme: filmeHeroi.id })}
                            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 w-full sm:w-auto"
                        >
                            <i className="fas fa-play mr-2"></i> Assistir Agora
                        </button>
                    )}
                    <button onClick={() => navegar('detalhes', { idFilme: filmeHeroi.id })} className="bg-gray-700 bg-opacity-60 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 active:scale-95 transform transition-all duration-300 w-full sm:w-auto">
                        <i className="fas fa-circle-info mr-2"></i> Mais Informações
                    </button>
                </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {filmesPopulares.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setIndiceHeroiAtual(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${indiceHeroiAtual === index ? 'bg-brand-accent scale-125' : 'bg-white/50 hover:bg-white'}`}
                    aria-label={`Ir para o destaque ${index + 1}`}
                />
            ))}
        </div>
      </div>

      {/* Seção de Conteúdo */}
      <div className="container mx-auto px-6 lg:px-16 mt-8">
        <CarrosselFilmes titulo="Populares na 7ª Arte" filmes={filmesPopulares} carregando={carregando} navegar={navegar} chaveCategoria="populares" usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} aoAtualizarMinhaLista={aoAtualizarMinhaLista} />
        <CarrosselFilmes titulo="Lançamentos" filmes={lancamentos} mostrarVerMais={true} carregando={carregando} navegar={navegar} chaveCategoria="lancamentos" usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} aoAtualizarMinhaLista={aoAtualizarMinhaLista} />
        <GradeGeneros generos={generos} carregando={carregando} navegar={navegar} />
        <CarrosselFilmes titulo="Clássicos do Cinema" filmes={classicosCinema} mostrarVerMais={true} carregando={carregando} navegar={navegar} chaveCategoria="classicos" usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} aoAtualizarMinhaLista={aoAtualizarMinhaLista} />
        <CarrosselFilmes titulo="Para Maratonar" filmes={seriesParaMaratonar} mostrarVerMais={true} carregando={carregando} navegar={navegar} chaveCategoria="series" usuarioAtual={usuarioAtual} abrirModalAutenticacao={abrirModalAutenticacao} aoAtualizarMinhaLista={aoAtualizarMinhaLista} />
      </div>
    </div>
  );
};

export default Home;