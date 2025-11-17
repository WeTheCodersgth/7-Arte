// Interfaces que definem a estrutura dos dados da aplicação.

export interface Episodio {
  numeroEpisodio: number;
  titulo: string;
  descricao: string;
  miniatura: string;
  duracao: string;
}

export interface Temporada {
  numeroTemporada: number;
  episodios: Episodio[];
}

export interface Conteudo {
  id: number;
  titulo: string;
  avaliacao: number;
  poster: string;
  descricao:string;
  ano: number;
  duracao: string;
  generos: string[];
  imagemFundo: string;
  tipo: 'movie' | 'series';
  urlTrailer?: string; // Formato para embed: https://www.youtube.com/embed/VIDEO_ID
  temporadas?: Temporada[];
  urlVideo?: string;
}

export interface Genero {
  nome: string;
  imagem: string;
  descricao: string;
  imagemHeroi: string;
}

export interface Comentario {
    id: number;
    usuario: string;
    avatar: string;
    texto: string;
    dataHora: Date;
    curtidas: number;
    respostas: Comentario[];
}

export interface DadosAvaliacao {
    media: number;
    total: number;
    distribuicao: { estrelas: number; porcentagem: number }[];
}

export interface MetadadosColecao {
  titulo: string;
  descricao: string;
  imagemHeroi: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string; 
  minhaLista: number[]; // Array de IDs de filmes/séries
}