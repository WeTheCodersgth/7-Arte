import { dadosAvaliacaoMock } from '../banco/avaliacoes';
import { DadosAvaliacao } from '../banco/types';

// API para buscar dados de avaliações.

// Retorna os dados de avaliação para um determinado conteúdo.

export const buscarDadosAvaliacaoParaConteudo = (idConteudo: number): DadosAvaliacao => {
    // Retorna sempre os mesmos dados de avaliação.
    return dadosAvaliacaoMock;
};