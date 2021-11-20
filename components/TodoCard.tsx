import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";;
interface Props {
    index: number
    card_id: number
    card_description: string
}


function TodoCard(props: Props) {
    return (
        <Draggable key={props.index} draggableId={props.card_id.toString()} index={props.index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div className={styles.card}>
                        {props.card_description}
                    </div>
                </div>
            )
            }
        </Draggable>
    )
}

export default TodoCard;