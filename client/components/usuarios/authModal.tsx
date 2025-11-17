import React, { useState, useEffect } from 'react';
import { autenticarUsuario } from '../../api/usuarioAPI';
import { Usuario } from '../../banco/types';

interface PropsModalAutenticacao {
  aoFechar: () => void;
  aoLogarComSucesso: (usuario: Usuario) => void;
}

// Define os diferentes "telas" ou "views" que o modal pode exibir.
type Tela = 'login' | 'registrar' | 'recuperar' | 'redefinir';

// Conteúdo visual para cada tela, como imagem de fundo e textos.
const conteudoTela = {
    login: {
        urlImagem: "https://image.tmdb.org/t/p/original/iSsgXRqGdZzaPAqO1vRrC20YYpH.jpg", 
        titulo: "Sua jornada cinematográfica continua aqui.",
        subtitulo: "Reviva seus momentos favoritos e descubra novas histórias."
    },
    registrar: {
        urlImagem: "https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg", 
        titulo: "Um novo universo de filmes espera por você.",
        subtitulo: "Crie sua conta e tenha acesso a um catálogo ilimitado de clássicos e lançamentos."
    },
    recuperar: {
        urlImagem: "https://image.tmdb.org/t/p/original/ukfzshUEvxX81X199zx3xItOk1h.jpg",
        titulo: "Esqueceu sua senha? Acontece.",
        subtitulo: "Vamos te ajudar a recuperar o acesso para que você não perca o próximo grande filme."
    },
    redefinir: {
        urlImagem: "https://image.tmdb.org/t/p/original/fvPYwfXH513e8Nqe0kzWFm2jjg.jpg", 
        titulo: "Um novo começo para sua segurança.",
        subtitulo: "Crie uma senha forte e volte a explorar o melhor do cinema com tranquilidade."
    }
};

// Componente de input reutilizável  para os formulários.
const InputFormulario = ({ id, label, type, icon, ehSenha, visivel, aoAlternarVisibilidade, ...props }: any) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium text-brand-secondary mb-1 block">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className={`fas ${icon} text-brand-secondary`}></i>
            </span>
            <input
                id={id}
                type={ehSenha ? (visivel ? 'text' : 'password') : type}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-10 text-brand-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-colors"
                {...props}
            />
             {ehSenha && (
                <button
                    type="button"
                    onClick={aoAlternarVisibilidade}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-secondary hover:text-brand-primary"
                    aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
                >
                    <i className={`fas ${visivel ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
            )}
        </div>
    </div>
);

const ModalAutenticacao = ({ aoFechar, aoLogarComSucesso }: PropsModalAutenticacao) => {
    const [tela, setTela] = useState<Tela>('login');
    const [fechando, setFechando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
    const conteudoAtual = conteudoTela[tela];

    // Efeito para adicionar listeners de teclado e travar o scroll do body.
    useEffect(() => {
        const lidarComTeclaPressionada = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                lidarComFechamento();
            }
        };
        document.addEventListener('keydown', lidarComTeclaPressionada);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', lidarComTeclaPressionada);
            document.body.style.overflow = 'unset';
        };
    }, []);

    // redefinira a visibilidade da senha e mensagens de erro ao trocar de tela.
    useEffect(() => {
        setMostrarSenha(false);
        setMostrarConfirmarSenha(false);
        setMensagemErro(null);
    }, [tela]);

    //  Lida com o fechamento do modal, com uma animação de saída.
    const lidarComFechamento = () => {
        setFechando(true);
        setTimeout(() => {
            aoFechar();
        }, 300); 
    };
    
    //  Lida com a submissão do formulário de login.
    const lidarComEnvioLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensagemErro(null);
        const dadosFormulario = new FormData(e.currentTarget);
        const email = dadosFormulario.get('email') as string;
        const senha = dadosFormulario.get('password') as string;

        const resultado = autenticarUsuario(email, senha);

        if (resultado.usuario) {
            aoLogarComSucesso(resultado.usuario);
        } else if (resultado.erro === 'email_not_found') {
            setMensagemErro('Nenhum usuário encontrado com este e-mail.');
        } else if (resultado.erro === 'invalid_password') {
            setMensagemErro('Senha incorreta. Por favor, tente novamente.');
        }
    };

    //  Renderiza o conteúdo do formulário com base na `tela` atual.
    const renderizarConteudo = () => {
        switch (tela) {
            case 'login':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">Bem-vindo de volta</h2>
                        <p className="text-brand-secondary mb-6 text-center">Entre para continuar sua jornada.</p>
                        <form className="space-y-4" onSubmit={lidarComEnvioLogin}>
                            <InputFormulario id="email" name="email" label="Email" type="email" icon="fa-envelope" placeholder="espectador@email.com" required />
                            <InputFormulario 
                                id="password"
                                name="password"
                                label="Senha" 
                                type="password" 
                                icon="fa-lock" 
                                placeholder="password123" 
                                ehSenha
                                visivel={mostrarSenha}
                                aoAlternarVisibilidade={() => setMostrarSenha(!mostrarSenha)}
                                required
                            />
                            {mensagemErro && <p className="text-sm text-red-500">{mensagemErro}</p>}
                            <div className="text-right">
                                <button type="button" onClick={() => setTela('recuperar')} className="text-sm text-brand-accent hover:underline">Esqueceu a senha?</button>
                            </div>
                            <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-base">
                                Entrar
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-brand-secondary">
                            Não tem uma conta? <button onClick={() => setTela('registrar')} className="font-semibold text-brand-accent hover:underline">Cadastre-se</button>
                        </p>
                    </>
                );
            case 'registrar':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">Crie sua Conta</h2>
                        <p className="text-brand-secondary mb-6 text-center">É rápido e fácil. Comece a explorar agora.</p>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Funcionalidade de cadastro não implementada.'); }}>
                            <InputFormulario id="name" label="Nome Completo" type="text" icon="fa-user" placeholder="Seu nome" />
                            <InputFormulario id="reg-email" label="Email" type="email" icon="fa-envelope" placeholder="seu@email.com" />
                            <InputFormulario 
                                id="reg-password" 
                                label="Senha" 
                                type="password" 
                                icon="fa-lock" 
                                placeholder="Crie uma senha forte" 
                                ehSenha
                                visivel={mostrarSenha}
                                aoAlternarVisibilidade={() => setMostrarSenha(!mostrarSenha)}
                            />
                             <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-base">
                                Criar Conta
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-brand-secondary">
                            Já tem uma conta? <button onClick={() => setTela('login')} className="font-semibold text-brand-accent hover:underline">Entre</button>
                        </p>
                    </>
                );
            case 'recuperar':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">Recuperar Senha</h2>
                        <p className="text-brand-secondary mb-6 text-center">Enviaremos um link de redefinição para o seu e-mail.</p>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTela('redefinir'); }}>
                             <InputFormulario id="recuperar-email" label="Email" type="email" icon="fa-envelope" placeholder="seu@email.com" />
                             <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-base">
                                Enviar Link
                            </button>
                        </form>
                        <p className="mt-6 text-center text-sm text-brand-secondary">
                            Lembrou a senha? <button onClick={() => setTela('login')} className="font-semibold text-brand-accent hover:underline">Voltar para o Login</button>
                        </p>
                    </>
                );
            case 'redefinir':
                return (
                     <>
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">Redefinir Senha</h2>
                        <p className="text-brand-secondary mb-6 text-center">Crie uma nova senha para sua conta.</p>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Funcionalidade não implementada.'); setTela('login'); }}>
                             <InputFormulario 
                                id="new-password" 
                                label="Nova Senha" 
                                type="password" 
                                icon="fa-lock" 
                                placeholder="••••••••" 
                                ehSenha
                                visivel={mostrarSenha}
                                aoAlternarVisibilidade={() => setMostrarSenha(!mostrarSenha)}
                            />
                             <InputFormulario 
                                id="confirm-new-password" 
                                label="Confirmar Nova Senha" 
                                type="password" 
                                icon="fa-lock" 
                                placeholder="••••••••" 
                                ehSenha
                                visivel={mostrarConfirmarSenha}
                                aoAlternarVisibilidade={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                             />
                             <button type="submit" className="w-full bg-brand-accent text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 active:scale-95 transform transition-all duration-300 shadow-lg shadow-brand-accent/30 text-base">
                                Redefinir e Entrar
                            </button>
                        </form>
                     </>
                );
            default: return null;
        }
    }
    
    return (
        <div 
             className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${fechando ? 'opacity-0' : 'opacity-100'}`}
             onClick={lidarComFechamento}
        >
            <div 
                className={`relative w-full max-w-4xl min-h-[600px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex transition-transform duration-300 ${fechando ? 'scale-95' : 'scale-100'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={lidarComFechamento} className="absolute top-4 right-5 text-gray-500 hover:text-white transition-colors z-20" aria-label="Fechar modal">
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Coluna Visual Esquerda */}
                <div className="hidden md:block md:w-1/2 lg:w-5/12 relative">
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out" style={{ backgroundImage: `url(${conteudoAtual.urlImagem})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                        <h2 className="text-3xl font-bold font-display leading-tight">{conteudoAtual.titulo}</h2>
                        <p className="text-brand-secondary mt-2">{conteudoAtual.subtitulo}</p>
                    </div>
                </div>

                {/* Coluna do Formulário Direita */}
                <div className="relative w-full md:w-1/2 lg:w-7/12 flex items-center justify-center p-8 sm:p-12">
                     {/* Fundo e Overlay para Mobile */}
                    <div
                        className="md:hidden absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${conteudoAtual.urlImagem})` }}
                    ></div>
                    <div className="md:hidden absolute inset-0 bg-gray-900/75"></div>
                    
                    <div className="relative w-full max-w-md">
                         <div className="flex justify-center mb-6">
                            <img src="assets/img/logo.png" alt="7ª Arte" className="w-24" />
                        </div>
                        {renderizarConteudo()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ModalAutenticacao;