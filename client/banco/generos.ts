import { Genero, MetadadosColecao } from './types';
import { baseUrlImagemFundo } from './filmes';

// Imagens de exemplo para os gêneros.
const genreComedia = "https://image.tmdb.org/t/p/original/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg";
const genreScifi = "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg";
const genreDrama = "https://image.tmdb.org/t/p/original/sRLC052ieEzkQs9dEtPMfFxYkej.jpg";

// Imagens de herói para as páginas de categoria.
const heroAcao = baseUrlImagemFundo + "/mtgqrSlT47VsmeMVanLTny7BknB.jpg"; 
const heroComedia = baseUrlImagemFundo + "/k1QdGxg2QANL4pLaVd1eJHbcrk.jpg"; 
const heroScifi = baseUrlImagemFundo + "/pbrkL804c8yAv3zBZR4QPEafpAR.jpg";
const heroTerror = baseUrlImagemFundo + "/46FRuTpdHn25pvyQhr2S2aY8zVR.jpg"; 
const heroDrama = baseUrlImagemFundo + "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg"; 
const heroAnimacao = baseUrlImagemFundo + "/k0Thm2l8cQjH6aB2Bd2y37iSjA8.jpg"; 
const heroLancamentos = baseUrlImagemFundo + "/vVpEOvGAsKxjEFdeYTE8klwyMe5.jpg"; 
const heroClassicos = baseUrlImagemFundo + "/ejdD20cdHNFAYAN2Htn2uP6m2j9.jpg"; 
const heroSeries = baseUrlImagemFundo + "/99vBORZixICa32Pwdwj0lWcr8K.jpg"; 
const heroPopulares = baseUrlImagemFundo + "/H6vke7zGiuLsz4v4RPeReb9rI25.jpg"; 
const heroMinhaLista = baseUrlImagemFundo + "/5i6S0v2BAd76iGzAlm2oKMCDB6W.jpg"; 

// Mapeamento de metadados para cada tipo de coleção.
export const metadadosColecao: Record<string, MetadadosColecao> = {
  'populares': {
    titulo: "Populares na 7ª Arte",
    descricao: "Os títulos que estão em alta. Veja o que a comunidade está assistindo e se surpreenda com as histórias mais aclamadas do momento.",
    imagemHeroi: heroPopulares,
  },

  'lancamentos': {
    titulo: "Lançamentos",
    descricao: "As últimas novidades do cinema e da TV, direto para a sua tela. Fique por dentro dos filmes e séries que acabaram de chegar.",
    imagemHeroi: heroLancamentos,
  },

  'classicos': {
    titulo: "Clássicos do Cinema",
    descricao: "Obras-primas que definiram gerações. Revisite os filmes que marcaram a história e continuam a inspirar cineastas e espectadores.",
    imagemHeroi: heroClassicos,
  },

  'series': {
    titulo: "Para Maratonar",
    descricao: "Prepare a pipoca e comece a maratona. Séries viciantes com tramas envolventes que vão te prender do primeiro ao último episódio.",
    imagemHeroi: heroSeries,
  },

  'filmes': {
    titulo: "Filmes",
    descricao: "Explore nosso vasto catálogo de filmes. De blockbusters a produções independentes, uma aventura cinematográfica para cada gosto.",
    imagemHeroi: heroAcao,
  },

  'minha-lista': {
    titulo: "Minha Lista",
    descricao: "Seus favoritos, todos em um só lugar. Continue de onde parou ou reveja os títulos que você mais amou.",
    imagemHeroi: heroMinhaLista,
  },

};

export const generos: Genero[] = [
  {
    nome: "Ação",
    imagem: genreDrama,
    descricao: "Adrenalina pura com perseguições, explosões e heróis inesquecíveis. Prepare-se para sequências de tirar o fôlego.",
    imagemHeroi: heroAcao,
  },

  {
    nome: "Comédia",
    imagem: genreComedia,
    descricao: "Gargalhadas garantidas. Os melhores filmes para relaxar, se divertir e ver o lado mais leve da vida.",
    imagemHeroi: heroComedia,
  },

  {
    nome: "Ficção Científica",
    imagem: genreScifi,
    descricao: "Explore outros mundos, futuros distópicos e as fronteiras da imaginação com histórias que desafiam a realidade.",
    imagemHeroi: heroScifi,
  },

  {
    nome: "Terror",
    imagem: genreComedia,
    descricao: "Sustos, suspense e criaturas aterrorizantes. Para os corajosos que gostam de sentir um arrepio na espinha.",
    imagemHeroi: heroTerror,
  },

  {
    nome: "Drama",
    imagem: genreDrama,
    descricao: "Histórias emocionantes e personagens complexos que exploram a profundidade da condição humana.",
    imagemHeroi: heroDrama,
  },

  {
    nome: "Animação",
    imagem: genreScifi,
    descricao: "Da magia dos contos de fadas às aventuras épicas, a animação quebra barreiras e encanta todas as idades.",
    imagemHeroi: heroAnimacao,
  },

];
