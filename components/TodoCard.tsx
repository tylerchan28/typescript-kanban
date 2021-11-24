import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";import React from "react";
import axios from "axios";

interface Props {
    index: number
    card_id: number
    card_description: string
    onDelete: (card_id: number) => void;
}

function TodoCard(props: Props) {

    const onDeleteCard = (e: React.FormEvent) => {
        e.preventDefault();
        props.onDelete(props.card_id);
    }

    return (
        <Draggable key={props.index} draggableId={props.card_id!.toString()} index={props.index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div className={styles.card}>
                        {props.card_description}
                        <button onClick={onDeleteCard}> X</button>
                    </div>
                </div>
            )
            }
        </Draggable>
    )
}

export default TodoCard;