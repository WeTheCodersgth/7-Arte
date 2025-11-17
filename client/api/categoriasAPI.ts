import { generos, metadadosColecao } from '../banco/generos';
import { MetadadosColecao, Conteudo } from '../banco/types';
import { buscarTodoConteudo, buscarFilmesPopulares, buscarLancamentos, buscarClassicosCinema, buscarSeriesParaMaratonar } from './conteudoAPI';

// Função utilitária para embaralhar um array (Fisher-Yates).

const embaralharArray = (array: any[]): any[] => {
    let indiceAtual = array.length, indiceAleatorio;
    const novoArray = [...array];
    while (indiceAtual !== 0) {
        indiceAleatorio = Math.floor(Math.random() * indiceAtual);
        indiceAtual--;
        [novoArray[indiceAtual], novoArray[indiceAleatorio]] = [novoArray[indiceAleatorio], novoArray[indiceAtual]];
    }
    return novoArray;
};

// Simula a busca de filmes por nome de gênero.
 
export const buscarConteudoPorNomeGenero = (nomeGenero: string): Conteudo[] => {
    const todoConteudo = buscarTodoConteudo();
    // Retorna uma versão embaralhada de todo o conteúdo.
    return embaralharArray([...todoConteudo]).slice(0, 10 + Math.floor(Math.random() * 8));
};

// Obtém o conteúdo com base em uma chave de categoria de coleção.

export const buscarConteudoPorCategoria = (categoria: string): Conteudo[] => {
    switch (categoria) {
        case 'populares':
            return buscarFilmesPopulares();
        case 'lancamentos':
            return buscarLancamentos();
        case 'classicos':
            return buscarClassicosCinema();
        case 'series':
            return buscarSeriesParaMaratonar();
        case 'filmes':
            return [...buscarFilmesPopulares(), ...buscarLancamentos(), ...buscarClassicosCinema()];
        default:
            return [];
    }
};

// Obtém os metadados (título, descrição, imagem da hero) para uma página de categoria.
 
export const buscarMetadadosCategoria = (tipo: 'genre' | 'collection', valor: string): MetadadosColecao | null => {
    let metadados: MetadadosColecao | null = null;

    if (tipo === 'genre') {
        const genero = generos.find(g => g.nome === valor);
        if (genero) {
            metadados = {
                titulo: `Gênero: ${genero.nome}`,
                descricao: genero.descricao,
                imagemHeroi: genero.imagemHeroi,
            };
        }
    } else if (tipo === 'collection') {
        const metadadosEncontrados = metadadosColecao[valor];
        if (metadadosEncontrados) {
            metadados = { ...metadadosEncontrados }; // Cria uma cópia para evitar mutações.
        }
    }

    if (metadados) {
        // Fallback para a imagem de hero de 'filmes' se uma específica não for encontrada.
        if (!metadados.imagemHeroi) {
            metadados.imagemHeroi = metadadosColecao['filmes'].imagemHeroi;
        }
    }

    return metadados;
};