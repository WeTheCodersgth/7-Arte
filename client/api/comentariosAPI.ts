import { comentariosMock } from '../banco/comentarios';
import { Comentario } from '../banco/types';

// API para buscar dados de comentários.

// Retorna os comentários para um determinado conteúdo.

export const buscarComentariosParaConteudo = (idConteudo: number): Comentario[] => {
    // Retorna sempre a mesma lista de comentários.
    return comentariosMock;
};