import { generos } from '../banco/generos';
import { Genero } from '../banco/types';

// API para buscar dados de gêneros.

// Retorna a lista de todos os gêneros.

export const buscarGeneros = (): Genero[] => {
    return generos;
};