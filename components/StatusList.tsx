import { Droppable } from "react-beautiful-dnd";
import styles from "../styles/TodoCard.module.css";
import TodoCard from "./TodoCard";

type Props = {
    project_name: string
    list_id: number
}

function StatusList({ project_name, list_id }: Props) {
    return (
        <Droppable droppableId={project_name}>
                  {(provided) => 
                    <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                        <div>Completed</div>
                        {cards.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </div>
                  }
        </Droppable>
    )
}

export const getServerSideProps = () => {
    // Within this list, GET all the cards associated with the list_id
    // cards will be added to props and then mapped (maybe useState as well)

}

export default StatusList


// map the todo cards under here (will then be called under [projectId].tsx)