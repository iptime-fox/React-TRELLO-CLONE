import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { styled } from 'styled-components';
import { toDoState } from './atoms';
import Board from './Components/Board';
import { useForm } from 'react-hook-form';

const Wrapper = styled.div`
  display: flex;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px;
`;

const Form = styled.form`
  input {
    border: none;
    border-bottom: 2px solid #6f63ef;
    background-color: transparent;
    margin-bottom: 1rem;
    text-align: center;
    width: 100%;
    padding: 0.5rem;
    font-size: 18px;
  }
  width: 200px;
`;

// const DeleteBtn = styled.div`
//   position: absolute;
//   right: 10%;
//   bottom: 10%;
//   transform: translate(-10%, -10%);
//   font-size: 2.5rem;
// `;

interface IBoardProps {
  boardId: string;
}

interface IForm {
  category: string;
}

function App({ boardId }: IBoardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      const newBoards = { ...allBoards, [category]: [] };
      return newBoards;
    });
    setValue('category', '');
  };
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;

    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }

    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  return (
    <Wrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register('category', { required: true })}
            type='text'
            placeholder='+ Add Category'
          />
        </Form>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </DragDropContext>
      {/* <DeleteBtn>🗑️</DeleteBtn> */}
    </Wrapper>
  );
}

export default App;
