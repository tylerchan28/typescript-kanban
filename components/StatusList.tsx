import { Droppable } from "react-beautiful-dnd";
import { Card } from "../models/card-model";
import styles from "../styles/TodoCard.module.css";
import TodoCard from "./TodoCard";

type Props = {
    list_name: string
    cards: Card[]
    index: number
    list_id: number
    deleteCard: (card_id: number, list_id: number) => void;
    editCard: (card_id: number, list_id: number, description: string) => void;
    deleteList: (list_id: number) => void;
}

function StatusList({ list_name, list_id, cards, deleteCard, editCard, deleteList }: Props) {
    const onDeleteCard = (card_id: number) => {
        deleteCard(card_id, list_id);
    }

    const onEditCard = (card_id: number, description: string) => {
        editCard(card_id, list_id, description)
    }

    const onDeleteList = (list_id: number) => {
        deleteList(list_id)
    }

    return (
            <Droppable droppableId={list_id.toString()} >
                      {(provided) => 
                        <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                            <div>
                                {list_name}
                                <button onClick={() => onDeleteList(list_id)}>X</button>
                            </div>
                            {cards.map((card: Card, index: number) => (
                                <TodoCard card_id={card.card_id} key={card.card_id} index={index} card_description={card.card_description} onDelete={onDeleteCard} onEdit={onEditCard} />
                            ))}
                            {provided.placeholder}
                        </div>
                      }
            </Droppable>
    )
}


export default StatusList

