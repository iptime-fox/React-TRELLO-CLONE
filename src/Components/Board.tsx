import { Droppable } from 'react-beautiful-dnd';
import DragabbleCard from './DraggableCard';
import { styled } from 'styled-components';
import { useForm } from 'react-hook-form';
import { ITodo, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 20px;
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
    border: none;
    border-bottom: 2px solid #ffcbcb;
    background-color: transparent;
    text-align: center;
    font-weight: 400;
  }
  padding: 0 1rem;
`;

const DropWrapper = styled.div`
  padding: 10px;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? '#fdf48e'
      : props.isDraggingFromThis
      ? '#FFFDDE'
      : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue('toDo', '');
  };
  return (
    <Wrapper>
      <Title>🧸 {boardId} 🧸</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register('toDo', { required: true })}
          type='text'
          placeholder={`Add task on ${boardId}`}
        />
      </Form>

      <DropWrapper>
        <Droppable droppableId={boardId}>
          {(magic, snapshot) => (
            <Area
              isDraggingOver={snapshot.isDraggingOver}
              isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
              ref={magic.innerRef}
              {...magic.droppableProps}>
              {toDos.map((toDo, index) => (
                <DragabbleCard
                  key={toDo.id}
                  index={index}
                  toDoId={toDo.id}
                  toDoText={toDo.text}
                />
              ))}

              {magic.placeholder}
            </Area>
          )}
        </Droppable>
      </DropWrapper>
    </Wrapper>
  );
}
export default Board;
