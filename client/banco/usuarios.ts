import { Usuario } from './types';

// Simula uma tabela de usuários no banco de dados.
export const usuariosMock: Usuario[] = [
    {
        id: 1,
        nome: 'Espectador Alpha',
        email: 'espectador@email.com',
        senha: 'password123',
        minhaLista: [1, 5, 19, 21] // IDs de Duna, O Retorno do Rei, Breaking Bad, Stranger Things
    },
    {
        id: 2,
        nome: 'Cinéfila Beta',
        email: 'cinefila@email.com',
        senha: 'password123',
        minhaLista: [15, 13, 24] // IDs de Pulp Fiction, O Poderoso Chefão, Peaky Blinders
    }
];