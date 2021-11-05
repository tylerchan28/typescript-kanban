import { useRouter } from "next/router";
import { useState } from "react";
import projectFixture from "../../fixtures/projectExample";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import TodoCard from "../../components/TodoCard";
import { DragDropContext, Droppable, resetServerContext } from "react-beautiful-dnd";

interface Props {
  project: Project;
}
// for todos, inprogress, completed arrays, map the objects to a component (make later)
// those components need to be draggable and have the logic to switch around the statuses
const project = ({ project }: Props) => {
  const router = useRouter();
  const { projectId } = router.query;

  const [todos, updateTodos] = useState(project.todo)

  const handleDragEndSameColumn = (result: any) => {
    console.log(result)
    if (!result.destination) {
        return;
    }
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    updateTodos(items)
    console.log(todos)
    // to support between columns, use if checks with result.destination and remove using result.source
  }

  return (
    
    <div>
      <div>{project.projectName}</div>
      <div>Project {projectId}</div>
      <div className={styles.main}>
        <div>
          <div>To Do</div>
          <button>Add todo</button>
          <DragDropContext onDragEnd={handleDragEndSameColumn}>
              <Droppable droppableId="todos">
                  {(provided) => 
                    <ul className="todos" {...provided.droppableProps} ref={provided.innerRef}>
                        {todos.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </ul>
                  }
              </Droppable>
          </DragDropContext>
        </div>
        <div className={styles.status}>
          <div>In Progress</div>
          <DragDropContext onDragEnd={() => console.log("yes")}>
              <Droppable droppableId="todos">
                  {(provided) => 
                    <ul className="todos" {...provided.droppableProps} ref={provided.innerRef}>
                        {project.inProgress.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </ul>
                  }
              </Droppable>
          </DragDropContext>
        </div>
        <div className={styles.status}>
          <div>Completed</div>
          <DragDropContext onDragEnd={() => console.log("yes")}>
              <Droppable droppableId="todos">
                  {(provided) => 
                    <ul className="todos" {...provided.droppableProps} ref={provided.innerRef}>
                        {project.completed.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </ul>
                  }
              </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

// Used to get data from server
// Filter the project that matches the context.params.projectId from the database
// need to use axios/async function
export const getServerSideProps = (context: any) => {
  const res = projectFixture;
  const projectArr = res.filter(
    (data) => data.projectId === parseInt(context.params.projectId)
  );
  const project = projectArr[0];
  resetServerContext()
  return {
    props: {
      project,
    },
  };
};

export default project;
