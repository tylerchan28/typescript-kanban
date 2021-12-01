import { Droppable } from "react-beautiful-dnd";
import { Card } from "../models/card-model";
import styles from "../styles/StatusList.module.css";
import TodoCard from "./TodoCard";
import { useState, useRef } from "react";
import { Trash2, Plus, X } from "react-feather";

type Props = {
  list_name: string;
  cards: Card[];
  index: number;
  list_id: number;
  addCard: (list_id: number, card_description: string) => void;
  deleteCard: (card_id: number, list_id: number) => void;
  editCard: (card_id: number, list_id: number, description: string) => void;
  deleteList: (list_id: number) => void;
};

function StatusList({
  list_name,
  list_id,
  cards,
  deleteCard,
  editCard,
  deleteList,
  addCard,
}: Props) {
  const [addCardForm, showAddCardForm] = useState(false);
  const cardDescriptionRef = useRef<HTMLInputElement>(null);

  const onAddCard = (
    e: React.FormEvent,
    list_id: number,
    card_description: string
  ) => {
    e.preventDefault();
    addCard(list_id, card_description);
    showAddCardForm(false);
    cardDescriptionRef.current!.value = "";
  };

  const onDeleteCard = (card_id: number) => {
    deleteCard(card_id, list_id);
  };

  const onEditCard = (card_id: number, description: string) => {
    editCard(card_id, list_id, description);
  };

  const onDeleteList = (list_id: number) => {
    if (confirm("Are you sure you want to delete this list?") === true) {
      deleteList(list_id);
    } else {
      return;
    }
  };

  return (
    <Droppable droppableId={list_id.toString()}>
      {(provided) => (
        <div
          className={styles.list}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className={styles.list_container}>
            <div className={styles.list_title}>
              <div className={styles.list_name}>{list_name}</div>
              <button
                className={styles.list_button}
                onClick={() => onDeleteList(list_id)}
              >
                <Trash2 color="black" size={14} />
              </button>
            </div>
            {cards.map((card: Card, index: number) => (
              <TodoCard
                card_id={card.card_id}
                key={card.card_id}
                index={index}
                card_description={card.card_description}
                onDelete={onDeleteCard}
                onEdit={onEditCard}
              />
            ))}
            {provided.placeholder}
            {addCardForm === false && (
              <button
                className={styles.add_button}
                onClick={() => showAddCardForm(!addCardForm)}
              >
                <Plus color="gray" size={24} />
              </button>
            )}
            {addCardForm && (
              <form
                className={styles.add_card_form}
                onSubmit={(e) =>
                  onAddCard(e, list_id, cardDescriptionRef.current!.value)
                }
              >
                <input
                  className={styles.add_card_input}
                  type="text"
                  ref={cardDescriptionRef}
                  autoFocus={true}
                  placeholder="Enter a description..."
                  required
                />
                <div className={styles.form_button_container}>
                  <button className={styles.form_add_button} type="submit">
                    Add Card
                  </button>
                  <button
                    className={styles.form_cancel_button}
                    onClick={() => showAddCardForm(false)}
                  >
                    <X color="gray" size={24}/>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default StatusList;
