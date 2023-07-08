import { atom, selector } from 'recoil';

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': ['🐯', '🦊', '🐬'],
    Doing: ['🐶', '🐻', '🐰'],
    Done: ['🐼', '🐹'],
  },
});
