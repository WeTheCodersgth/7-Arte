import { filmesPopulares, lancamentos, classicosCinema } from '../banco/filmes';
import { seriesParaMaratonar } from '../banco/series';
import { Conteudo } from '../banco/types';

// API para buscar conteúdo principal (filmes e séries).

export const buscarFilmesPopulares = (): Conteudo[] => {
    return filmesPopulares;
};

export const buscarLancamentos = (): Conteudo[] => {
    return lancamentos;
};

export const buscarClassicosCinema = (): Conteudo[] => {
    return classicosCinema;
};

export const buscarSeriesParaMaratonar = (): Conteudo[] => {
    return seriesParaMaratonar;
};

// Retorna uma lista unificada de todo o conteúdo (filmes e séries).

export const buscarTodoConteudo = (): Conteudo[] => {
    const dadosTodoConteudo = [
        ...filmesPopulares,
        ...lancamentos,
        ...classicosCinema,
        ...seriesParaMaratonar,
    ];
    // Remove duplicatas baseadas no ID para garantir uma lista única.
    return Array.from(new Map(dadosTodoConteudo.map(item => [item.id, item])).values());
};

// Busca um filme ou série específico pelo seu ID.

export const buscarConteudoPorId = (id: number): Conteudo | undefined => {
    return buscarTodoConteudo().find(conteudo => conteudo.id === id);
};

// Função utilitária para embaralhar um array (algoritmo Fisher-Yates).

const embaralharArray = (array: any[]): any[] => {
    let indiceAtual = array.length, indiceAleatorio;
    const novoArray = [...array]; // Cria uma cópia para não modificar o original
    while (indiceAtual !== 0) {
        indiceAleatorio = Math.floor(Math.random() * indiceAtual);
        indiceAtual--;
        [novoArray[indiceAtual], novoArray[indiceAleatorio]] = [novoArray[indiceAleatorio], novoArray[indiceAtual]];
    }
    return novoArray;
};

// Retorna uma lista de conteúdo relacionado (sugestões).

export const buscarConteudoRelacionado = (idConteudoAtual: number): Conteudo[] => {
    const todoConteudo = buscarTodoConteudo().filter(conteudo => conteudo.id !== idConteudoAtual);
    return embaralharArray(todoConteudo).slice(0, 6);
};