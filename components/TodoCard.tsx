import { Card } from "../models/card-model";
import styles from "../styles/TodoCard.module.css";

interface Props {
    todo: Card;
}

function TodoCard({ todo }: Props) {
    return (
        <div className={styles.card}>
            <div>{todo.id}</div>
            <div>{todo.description}</div>
            <div>{todo.status}</div>
        </div>
    )
}

export default TodoCard;