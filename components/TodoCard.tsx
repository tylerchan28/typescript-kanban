import { Card } from "../models/card-model";
import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";;
interface Props {
    todo: Card;
    index: number;
}

function TodoCard(props: Props) {

    // const dragStartHandler = (event: React.DragEvent<HTMLDivElement>) => {
    //     const id = (event.target as HTMLDivElement).id;
    //     event.dataTransfer!.setData("text/plain", id.toString());
    //     event.dataTransfer!.effectAllowed = "move";
    //     console.log("drag start")
    // }

    // const dragEndHandler = (_: React.DragEvent<HTMLDivElement>) => { console.log("drag end") }

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