import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import Cabecalho from './components/header';
import Rodape from './components/footer';
import Home from './pages/usuarios/home';
import PaginaCategoria from './pages/usuarios/categoria';
import Detalhes from './pages/usuarios/detalhes';
import Assistir from './pages/usuarios/assistir';
import ModalAutenticacao from './components/usuarios/authModal';
import { Usuario } from './banco/types';
import { adicionarAMinhaLista, removerDaMinhaLista } from './api/usuarioAPI';
import SplashScreen from './components/splashScreen';

// Define a estrutura do estado que controla a página atual e seus parâmetros.
export interface EstadoPagina {
  nome: string;
  parametros?: {
    idFilme?: number;
    tipo?: 'genre' | 'collection';
    valor?: string;
    titulo?: string;
  };
}

// Interface para as props que são passadas para as páginas que requerem autenticação.
export interface PropsPaginaAutenticada {
  navegar: (pagina: string, parametros?: EstadoPagina['parametros']) => void;
  usuarioAtual: Usuario | null;
  abrirModalAutenticacao: () => void;
  aoAtualizarMinhaLista: (idConteudo: number) => void;
}

const App = () => {
  const [pagina, setPagina] = useState<EstadoPagina>({ nome: 'home' });
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrandoSplash, setMostrandoSplash] = useState(true);
  const [ehCarregamentoInicial, setEhCarregamentoInicial] = useState(true);

  // Efeito para a tela de splash inicial.
  useEffect(() => {
    const duracaoSplash = ehCarregamentoInicial ? 5000 : 2000;
    const timer = setTimeout(() => {
      setMostrandoSplash(false);
      if (ehCarregamentoInicial) {
        setEhCarregamentoInicial(false);
      }
    }, duracaoSplash);
    return () => clearTimeout(timer);
  }, [pagina, ehCarregamentoInicial]);


  // Navega para uma nova página, exibindo a tela de splash durante a transição.

  const navegar = (nome: string, parametros?: EstadoPagina['parametros']) => {
    // Evita recarregar a mesma página.
    if (pagina.nome === nome && JSON.stringify(pagina.parametros) === JSON.stringify(parametros)) {
      window.scrollTo(0, 0);
      return;
    }

    setMostrandoSplash(true);

    // Espera a animação de fade-in da splash antes de trocar o conteúdo.
    setTimeout(() => {
      setPagina({ nome, parametros });
      window.scrollTo(0, 0);
    }, 300);
  };
  
  // Lida com o login bem-sucedido do usuário.
 
  const lidarComLogin = (usuarioLogado: Usuario) => {
    setUsuario(usuarioLogado);
    setModalAberto(false);
  };
  
  // Lida com o logout do usuário.

  const lidarComLogout = () => {
    setUsuario(null);
    navegar('home'); // Redireciona para a home após o logout.
  };

  // Adiciona ou remove um item da "Minha Lista" do usuário.

  const aoAtualizarMinhaLista = (idConteudo: number) => {
    if (!usuario) {
      setModalAberto(true);
      return;
    }
    const estaNaLista = usuario.minhaLista.includes(idConteudo);
    const usuarioAtualizado = estaNaLista 
        ? removerDaMinhaLista(usuario.id, idConteudo)
        : adicionarAMinhaLista(usuario.id, idConteudo);
    
    if (usuarioAtualizado) {
        setUsuario(usuarioAtualizado);
    }
  };

  // Renderiza a página atual com base no estado `pagina`.
  const renderizarPagina = () => {
    const propsComuns: PropsPaginaAutenticada = {
      navegar,
      usuarioAtual: usuario,
      abrirModalAutenticacao: () => setModalAberto(true),
      aoAtualizarMinhaLista: aoAtualizarMinhaLista
    };

    switch (pagina.nome) {
      case 'home':
        return <Home {...propsComuns} />;
      case 'categorias':
        return <PaginaCategoria {...propsComuns} {...pagina.parametros} />;
      case 'detalhes':
        return <Detalhes {...propsComuns} {...pagina.parametros} />;
      case 'assistir':
        return <Assistir {...propsComuns} {...pagina.parametros} />;
      default:
        return <Home {...propsComuns} />;
    }
  };

  return (
    <>
      <SplashScreen visivel={mostrandoSplash} />
      <Cabecalho 
        navegar={navegar} 
        paginaAtual={pagina}
        abrirModalAutenticacao={() => setModalAberto(true)}
        estaLogado={!!usuario}
        aoSair={lidarComLogout}
        nomeUsuario={usuario?.nome}
      />
      <main className="pt-20">
        {renderizarPagina()}
      </main>
      <Rodape />
      {modalAberto && <ModalAutenticacao aoFechar={() => setModalAberto(false)} aoLogarComSucesso={lidarComLogin} />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);