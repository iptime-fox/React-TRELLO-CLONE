import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from 'styled-components';
import { toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Card = styled.div<{ isDragging: boolean }>`
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.isDragging ? '#c17aff' : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none'};
  display: flex;
  column-gap: 5px;
  font-weight: 400;
  align-items: center;
  justify-content: space-between;
`;

const ToDoWrapper = styled.div``;

const BtnWrapper = styled.div`
  button {
    border: none;
    background-color: transparent;
  }
`;

interface IDragableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DragabbleCard({ toDoId, toDoText, index }: IDragableCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const onDeleteBtn = (id: string) => {
    setToDos((toDoCards) => {
      const copyBoard = { ...toDoCards };
      const keys = Object.keys(copyBoard);
      keys.forEach((key) => {
        copyBoard[key] = toDoCards[key].filter(
          (toDoCard) => toDoCard.id !== Number(id)
        );
      });
      return copyBoard;
    });
  };
  return (
    <Draggable draggableId={toDoId + ''} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}>
          <ToDoWrapper>{toDoText}</ToDoWrapper>
          <BtnWrapper>
            <button
              onClick={() => {
                onDeleteBtn(magic.draggableProps['data-rbd-draggable-id']);
              }}>
              ❌
            </button>
          </BtnWrapper>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
