import React, { useState, useEffect, useRef } from 'react';
import { buscarTodoConteudo } from '../api/conteudoAPI';
import { Conteudo } from '../banco/types';
import { EstadoPagina } from '..';

interface PropsCabecalho {
  navegar: (pagina: string, parametros?: EstadoPagina['parametros']) => void;
  paginaAtual: EstadoPagina;
  abrirModalAutenticacao: () => void;
  estaLogado: boolean;
  aoSair: () => void;
  nomeUsuario?: string;
}

const Cabecalho = ({ navegar, paginaAtual, abrirModalAutenticacao, estaLogado, aoSair, nomeUsuario }: PropsCabecalho) => {
  const [rolado, setRolado] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Conteudo[]>([]);
  const [todoConteudo, setTodoConteudo] = useState<Conteudo[]>([]);
  const [buscaVisivel, setBuscaVisivel] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const refContainerBusca = useRef<HTMLDivElement>(null);
  const refDropdown = useRef<HTMLDivElement>(null);

  // Efeito para buscar todo o conteúdo para a funcionalidade de pesquisa na montagem do componente.
  useEffect(() => {
    setTodoConteudo(buscarTodoConteudo());
  }, []);

  // Efeito para detectar a rolagem da página e alterar a aparência do cabeçalho.
  useEffect(() => {
    const lidarComRolagem = () => {
      const estaRolado = window.scrollY > 10;
      if (estaRolado !== rolado) {
        setRolado(estaRolado);
      }
    };

    document.addEventListener('scroll', lidarComRolagem);
    return () => {
      document.removeEventListener('scroll', lidarComRolagem);
    };
  }, [rolado]);

  // Efeito para fechar a busca e o dropdown do usuário ao clicar fora deles.
  useEffect(() => {
    const lidarComCliqueFora = (event: MouseEvent) => {
      if (refContainerBusca.current && !refContainerBusca.current.contains(event.target as Node)) {
        setBuscaVisivel(false);
      }
      if (refDropdown.current && !refDropdown.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    };
    document.addEventListener('mousedown', lidarComCliqueFora);
    return () => {
      document.removeEventListener('mousedown', lidarComCliqueFora);
    };
  }, []);

  // Efeito para travar a rolagem do corpo da página quando o menu mobile está aberto.
  useEffect(() => {
    if (menuMobileAberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuMobileAberto]);

  // Manipula a mudança no campo de busca, filtrando os resultados.

  const lidarComMudancaBusca = (e: React.ChangeEvent<HTMLInputElement>) => {
    const termo = e.target.value;
    setTermoBusca(termo);

    if (termo.trim().length > 0) {
      const resultadosFiltrados = todoConteudo.filter(conteudo =>
        conteudo.titulo.toLowerCase().includes(termo.toLowerCase())
      );
      setResultadosBusca(resultadosFiltrados);
    } else {
      setResultadosBusca([]);
    }
  };
  
  // Função de navegação wrapper para fechar o menu mobile ao navegar.
  
  const lidarComNavegacao = (pagina: string, parametros?: EstadoPagina['parametros']) => {
    navegar(pagina, parametros);
    setMenuMobileAberto(false);
  };
  
  // Lida com o clique em um resultado da busca, navegando para a página de detalhes.

  const lidarComCliqueResultadoBusca = (idFilme: number) => {
    navegar('detalhes', { idFilme });
    setBuscaVisivel(false);
    setTermoBusca('');
    setResultadosBusca([]);
  };

  // Lida com o clique no link "Minha Lista", abrindo o modal de login se o usuário não estiver logado.
  
  const lidarComCliqueMinhaLista = () => {
    if (estaLogado) {
      lidarComNavegacao('categorias', { tipo: 'collection', valor: 'minha-lista', titulo: 'Minha Lista' });
    } else {
      abrirModalAutenticacao();
      setMenuMobileAberto(false);
    }
  };

  // Componente de link de navegação para reutilização.
  const LinkNavegacao = ({ pagina, parametros, children }: { pagina: string, parametros?: EstadoPagina['parametros'], children: React.ReactNode }) => {
    const paramsAreEqual = (p1?: EstadoPagina['parametros'], p2?: EstadoPagina['parametros']) => {
        if (!p1 && !p2) return true;
        if (!p1 || !p2) return false;
        return JSON.stringify(p1) === JSON.stringify(p2);
    };
    
    const ehAtivo = paginaAtual.nome === pagina && paramsAreEqual(paginaAtual.parametros, parametros);

    return (
        <button
          onClick={() => lidarComNavegacao(pagina, parametros)}
          className={`transition-colors duration-300 ${ehAtivo ? 'text-brand-primary font-bold' : 'text-brand-secondary hover:text-brand-accent'}`}
        >
          {children}
        </button>
    );
  };

  const ehMinhaListaAtiva = paginaAtual.nome === 'categorias' && paginaAtual.parametros?.tipo === 'collection' && paginaAtual.parametros?.valor === 'minha-lista';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${rolado || paginaAtual.nome !== 'home' ? 'bg-brand-background shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto flex items-center justify-between p-4 lg:px-16">
          <div className="flex items-center space-x-8">
            <a href="#" onClick={(e) => { e.preventDefault(); lidarComNavegacao('home'); }}>
              <img src="assets/img/logo.png" alt="7ª Arte" className="h-8 w-auto" />
            </a>
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <LinkNavegacao pagina="home">Início</LinkNavegacao>
              <LinkNavegacao pagina="categorias" parametros={{ tipo: 'collection', valor: 'filmes', titulo: 'Filmes' }}>Filmes</LinkNavegacao>
              <LinkNavegacao pagina="categorias" parametros={{ tipo: 'collection', valor: 'series', titulo: 'Séries' }}>Séries</LinkNavegacao>
              <button
                onClick={lidarComCliqueMinhaLista}
                className={`transition-colors duration-300 ${ehMinhaListaAtiva ? 'text-brand-primary font-bold' : 'text-brand-secondary hover:text-brand-accent'}`}
              >
                Minha Lista
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={refContainerBusca}>
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary z-10"></i>
              <input 
                type="text" 
                placeholder="Buscar filmes e séries..." 
                className="bg-black bg-opacity-50 border border-gray-700 rounded-full py-1.5 px-4 pl-10 text-sm text-brand-primary placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all duration-300 w-48 md:w-56 focus:w-72"
                value={termoBusca}
                onChange={lidarComMudancaBusca}
                onFocus={() => setBuscaVisivel(true)}
              />
              
              {buscaVisivel && termoBusca.length > 0 && (
                <div className="absolute top-full mt-2 w-[22rem] max-h-96 overflow-y-auto custom-scrollbar bg-brand-background/90 backdrop-blur-sm rounded-lg shadow-2xl z-50 right-0">
                  {resultadosBusca.length > 0 ? (
                    <ul>
                      {resultadosBusca.map((conteudo) => (
                        <li key={conteudo.id} onClick={() => lidarComCliqueResultadoBusca(conteudo.id)}>
                          <div className="flex items-center p-3 hover:bg-gray-800/70 transition-colors duration-200 rounded-lg m-1 cursor-pointer">
                            <img src={conteudo.poster} alt={conteudo.titulo} className="w-12 h-auto rounded object-cover mr-4" />
                            <div className="flex-grow">
                              <p className="font-bold text-white text-sm">{conteudo.titulo}</p>
                              <div className="flex items-center text-xs text-brand-secondary mt-1">
                                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                                  <span>{conteudo.avaliacao}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-brand-secondary">
                      Nenhum resultado encontrado para "{termoBusca}".
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:block relative">
                <button
                    onClick={estaLogado ? () => setDropdownAberto(!dropdownAberto) : abrirModalAutenticacao}
                    className="text-brand-primary hover:text-brand-accent transition-colors duration-300"
                    aria-label="Menu do usuário"
                >
                    <i className="fas fa-user-circle text-2xl"></i>
                </button>

                {estaLogado && (
                    <div 
                        ref={refDropdown}
                        className={`absolute top-full right-0 mt-3 w-48 bg-gray-900 rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-700/50 transition-all duration-200 ease-out ${dropdownAberto ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                    >
                        <div className="px-4 py-3 border-b border-gray-700/50">
                            <p className="font-bold text-sm text-white truncate">{nomeUsuario || 'Usuário'}</p>
                            <p className="text-xs text-brand-secondary">Bem-vindo!</p>
                        </div>
                        <button
                            onClick={() => {
                                aoSair();
                                setDropdownAberto(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-brand-secondary hover:bg-brand-accent hover:text-white transition-colors flex items-center gap-2"
                        >
                            <i className="fas fa-sign-out-alt w-4"></i>
                            <span>Terminar Sessão</span>
                        </button>
                    </div>
                )}
            </div>

            <button 
              className="md:hidden text-brand-primary hover:text-brand-accent transition-colors duration-300"
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
              aria-label="Abrir menu"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <div className={`fixed inset-0 z-40 bg-brand-background/90 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuMobileAberto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                 <a href="#" onClick={(e) => { e.preventDefault(); lidarComNavegacao('home'); }}>
                    <img src="assets/img/logo.png" alt="7ª Arte" className="h-8 w-auto" />
                </a>
                <button 
                    onClick={() => setMenuMobileAberto(false)} 
                    className="text-white text-2xl"
                    aria-label="Fechar menu"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-grow space-y-8 text-xl">
                 <LinkNavegacao pagina="home">Início</LinkNavegacao>
                <LinkNavegacao pagina="categorias" parametros={{ tipo: 'collection', valor: 'filmes', titulo: 'Filmes' }}>Filmes</LinkNavegacao>
                <LinkNavegacao pagina="categorias" parametros={{ tipo: 'collection', valor: 'series', titulo: 'Séries' }}>Séries</LinkNavegacao>
                <button
                  onClick={lidarComCliqueMinhaLista}
                  className={`transition-colors duration-300 ${ehMinhaListaAtiva ? 'text-brand-primary font-bold' : 'text-brand-secondary hover:text-brand-accent'}`}
                >
                  Minha Lista
                </button>
                 
                 {estaLogado ? (
                   <div className="text-center mt-8">
                       <i className="fas fa-user-circle text-5xl text-brand-primary mb-3"></i>
                       <span className="block text-brand-primary text-lg font-semibold mb-4">{nomeUsuario || 'Usuário'}</span>
                       <button
                           onClick={() => {
                               aoSair();
                               setMenuMobileAberto(false);
                           }}
                           className="bg-brand-accent text-white font-bold py-2 px-8 rounded-full hover:bg-red-700 transition-colors"
                       >
                           Terminar Sessão
                       </button>
                   </div>
                 ) : (
                  <button
                      onClick={() => {
                        abrirModalAutenticacao();
                        setMenuMobileAberto(false);
                      }}
                      className="text-brand-primary hover:text-brand-accent transition-colors duration-300 mt-8"
                    >
                      <i className="fas fa-user-circle text-4xl"></i>
                      <span className="block text-sm mt-1">Entrar / Cadastrar</span>
                  </button>
                 )}
            </nav>
        </div>
      </div>
    </>
  );
};

export default Cabecalho;