import { Droppable } from "react-beautiful-dnd";
import { Card } from "../models/card-model";
import styles from "../styles/StatusList.module.css";
import TodoCard from "./TodoCard";
import { useState, useRef } from "react";

type Props = {
    list_name: string
    cards: Card[]
    index: number
    list_id: number
    addCard: (list_id: number, card_description: string) => void;
    deleteCard: (card_id: number, list_id: number) => void;
    editCard: (card_id: number, list_id: number, description: string) => void;
    deleteList: (list_id: number) => void;
}

function StatusList({ list_name, list_id, cards, deleteCard, editCard, deleteList, addCard }: Props) {
    const [addCardForm, showAddCardForm] = useState(false);
    const cardDescriptionRef = useRef<HTMLInputElement>(null);

    const onAddCard = (e: React.FormEvent, list_id: number, card_description: string) => {
        e.preventDefault();
        addCard(list_id, card_description);
        showAddCardForm(false);
        cardDescriptionRef.current!.value = "";
    }

    const onDeleteCard = (card_id: number) => {
        deleteCard(card_id, list_id);
    }

    const onEditCard = (card_id: number, description: string) => {
        editCard(card_id, list_id, description)
    }

    const onDeleteList = (list_id: number) => {
        if (confirm("Are you sure you want to delete this card?") === true) {
            deleteList(list_id);
        } else {
            return;
        }
    }

    return (
            <Droppable droppableId={list_id.toString()} >
                      {(provided) => 
                        <div className={styles.list} {...provided.droppableProps} ref={provided.innerRef}>
                            <div className={styles.list_title}>
                                {list_name}
                                <button onClick={() => onDeleteList(list_id)}>X</button>
                            </div>
                            {cards.map((card: Card, index: number) => (
                                <TodoCard card_id={card.card_id} key={card.card_id} index={index} card_description={card.card_description} onDelete={onDeleteCard} onEdit={onEditCard} />
                            ))}
                            <button onClick={() => showAddCardForm(!addCardForm)}>
                                Add Card
                            </button>
                            {addCardForm && 
                                <form onSubmit={(e) => onAddCard(e, list_id, cardDescriptionRef.current!.value)}>
                                    <input 
                                        type="text" 
                                        ref={cardDescriptionRef} 
                                    />
                                    <button type="submit">Add</button>
                                </form>
                            }
                            {provided.placeholder}
                        </div>
                      }
            </Droppable>
    )
}


export default StatusList

