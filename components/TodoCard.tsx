import { Card } from "../models/card-model";
import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";;
interface Props {
    todo: Card;
    index: number;
}

function TodoCard(props: Props) {

    return (
        <Draggable key={props.todo.id.toString()} draggableId={props.todo.id.toString()} index={props.index}>
            {(provided) => (
                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div className={styles.card}>
                        <div>{props.todo.id}</div>
                        <div>{props.todo.description}</div>
                        <div>{props.todo.status}</div>
                    </div>
                </li>
            )
            }
        </Draggable>
    )
}

export default TodoCard;