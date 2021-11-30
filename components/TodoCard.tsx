import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";
import { useState, useRef } from "react";

interface Props {
    index: number
    card_id: number
    card_description: string
    onDelete: (card_id: number) => void;
    onEdit: (card_id: number, description: string) => void;
}

function TodoCard(props: Props) {

    const [editForm, showEditForm] = useState(false);
    const editRef = useRef<HTMLInputElement>(null);

    const onDeleteCard = (e: React.FormEvent) => {
        e.preventDefault();
        props.onDelete(props.card_id);
    }

    const onEditCard = (e: React.FormEvent) => {
        e.preventDefault();
        const newDescription = editRef.current!.value;
        props.onEdit(props.card_id, newDescription)
        showEditForm(false)
    }

    return (
        <Draggable key={props.index} draggableId={props.card_id!.toString()} index={props.index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div className={styles.card}>
                        <div className={styles.button_container}>
                            <button className={styles.button} onClick={() => showEditForm(!editForm)}>Edit</button>
                            <button className={styles.button} onClick={onDeleteCard}>X</button>
                        </div>
                        <div>
                        { editForm ?
                                <form onSubmit={onEditCard}>
                                    <input
                                        type="text"
                                        defaultValue={props.card_description}
                                        ref={editRef}
                                    />
                                    <button type="submit">Save</button>
                                </form>
                                :
                                <div className={styles.card_description}>
                                    {props.card_description}
                                </div>
                        }
                        </div>
                    </div>
                    
                </div>
            )
            }
        </Draggable>
    )
}

export default TodoCard;