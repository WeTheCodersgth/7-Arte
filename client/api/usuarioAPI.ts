import { usuariosMock } from '../banco/usuarios';
import { Usuario, Conteudo } from '../banco/types';
import { buscarTodoConteudo, buscarConteudoPorId } from './conteudoAPI';

// Simula a autenticação de um usuário com feedback de erro específico.

export const autenticarUsuario = (email: string, senha: string): { usuario: Usuario | null; erro: 'email_not_found' | 'invalid_password' | null } => {
    const usuario = usuariosMock.find(u => u.email === email);
    if (!usuario) {
        return { usuario: null, erro: 'email_not_found' };
    }
    if (usuario.senha !== senha) {
        return { usuario: null, erro: 'invalid_password' };
    }
    return { usuario: usuario, erro: null };
};


// Busca um usuário pelo seu ID.

export const buscarUsuarioPorId = (idUsuario: number): Usuario | undefined => {
    return usuariosMock.find(u => u.id === idUsuario);
}

// Busca a "Minha Lista" de um usuário específico.

export const getMinhaLista = (idUsuario: number): Conteudo[] => {
    const usuario = buscarUsuarioPorId(idUsuario);
    if (!usuario) {
        return [];
    }
    
    // Mapeia os IDs da lista do usuário para os objetos Conteudo completos.
    return usuario.minhaLista
        .map(idConteudo => buscarConteudoPorId(idConteudo))
        .filter((conteudo): conteudo is Conteudo => conteudo !== undefined);
};

// Simula a adição de um item à "Minha Lista" de um usuário.

export const adicionarAMinhaLista = (idUsuario: number, idConteudo: number): Usuario | undefined => {
    const usuario = usuariosMock.find(u => u.id === idUsuario);
    if (usuario && !usuario.minhaLista.includes(idConteudo)) {
        usuario.minhaLista.push(idConteudo);
        console.log(`Item ${idConteudo} adicionado à lista do usuário ${idUsuario}. Lista atual:`, usuario.minhaLista);
        return { ...usuario }; // Retorna uma cópia para acionar a atualização de estado do React
    }
    return undefined; // Retorna undefined se nenhuma alteração foi feita
};

// Simula a remoção de um item da "Minha Lista" de um usuário.

export const removerDaMinhaLista = (idUsuario: number, idConteudo: number): Usuario | undefined => {
    const usuario = usuariosMock.find(u => u.id === idUsuario);
    if (usuario) {
        const indice = usuario.minhaLista.indexOf(idConteudo);
        if (indice > -1) {
            usuario.minhaLista.splice(indice, 1);
            console.log(`Item ${idConteudo} removido da lista do usuário ${idUsuario}. Lista atual:`, usuario.minhaLista);
            return { ...usuario }; // Retorna uma cópia
        }
    }
    return undefined; // Retorna undefined se nenhuma alteração foi feita
};