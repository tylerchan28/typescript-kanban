import styles from "../styles/TodoCard.module.css";
import { Draggable } from "react-beautiful-dnd";
import { useState, useRef } from "react";
import { Edit2, Trash2, X} from "react-feather";


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
        if (confirm("Are you sure you want to delete this card?") === true) {
            props.onDelete(props.card_id);
        } else {
            return;
        }        
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
                            <button className={styles.button} onClick={() => showEditForm(!editForm)}><Edit2 color="gray" size={14}/></button>
                            <button className={styles.button} onClick={onDeleteCard}><Trash2 color="gray" size={14} /></button>
                        </div>
                        <div>
                        { editForm ?
                                <form className={styles.edit_card_form} onSubmit={onEditCard}>
                                    <input
                                        type="text"
                                        className={styles.edit_card_input}
                                        defaultValue={props.card_description}
                                        ref={editRef}
                                        autoFocus
                                    />
                                    <div className={styles.edit_button_container}>
                                        <button className={styles.save_edit_button} type="submit">Save</button>
                                        <button className={styles.cancel_edit_button} onClick={() => showEditForm(false)}><X color="gray" size={24}/></button>
                                    </div>
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