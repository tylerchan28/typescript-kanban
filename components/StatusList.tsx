import { Droppable } from "react-beautiful-dnd";
import { Card } from "../models/card-model";
import styles from "../styles/TodoCard.module.css";
import TodoCard from "./TodoCard";

type Props = {
    list_id: number
    list_name: string
    cards: Card[]
    index: number
}

function StatusList({ list_name, list_id, cards, index }: Props) {
    return (
            <Droppable droppableId={index.toString()} >
                      {(provided) => 
                        <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                            {list_name}
                            {cards.map((card: Card, index: number) => (
                                <TodoCard card_id={card.card_id} key={card.card_id} index={index} card_description={card.card_description} />
                            ))}
                            {provided.placeholder}
                        </div>
                      }
            </Droppable>
    )
}


export default StatusList

