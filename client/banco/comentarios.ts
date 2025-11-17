import { Comentario } from './types';

export const comentariosMock: Comentario[] = [
    { 
        id: 1, 
        usuario: 'Cinefilo_77', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 
        texto: 'Que filmaço! A cinematografia é de outro nível. Recomendo demais!',
        dataHora: new Date(Date.now() - 3600000 * 2), // 2 horas atrás
        curtidas: 15,
        respostas: [
            {
                id: 4, 
                usuario: 'Maratoneira_BR', 
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', 
                texto: 'Concordo plenamente! A cena da tempestade de areia foi uma das coisas mais lindas que já vi no cinema.',
                dataHora: new Date(Date.now() - 3600000 * 1), // 1 hora atrás
                curtidas: 8,
                respostas: []
            }
        ]
    },
    { 
        id: 2, 
        usuario: 'Maratoneira_BR', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', 
        texto: 'O final me deixou de queixo caído. Alguém mais ficou chocado com aquele plot twist?',
        dataHora: new Date(Date.now() - 86400000 * 1), // 1 dia atrás
        curtidas: 22,
        respostas: []
    },
    { 
        id: 3, 
        usuario: 'Pipoca_e_Guarana', 
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', 
        texto: 'A trilha sonora é simplesmente perfeita. Já adicionei na minha playlist.',
        dataHora: new Date(Date.now() - 86400000 * 3), // 3 dias atrás
        curtidas: 5,
        respostas: []
    },
];