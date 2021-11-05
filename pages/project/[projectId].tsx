import { useRouter } from "next/router";
import { useState } from "react";
import projectFixture from "../../fixtures/projectExample";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import TodoCard from "../../components/TodoCard";
import { DragDropContext, Droppable, DropResult, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";


interface Props {
  project: Project;
}
 // to support between columns, use if checks with result.destination and remove using result.source
const project = ({ project }: Props) => {
  const router = useRouter();
  const { projectId } = router.query;

  const [todos, updateTodos] = useState(project.todo)
  const [inProgress, updateInProgress] = useState(project.inProgress)
  const [completed, updateCompleted] = useState(project.completed)

  const getList = (id: string) => {
    if (id === "todos") {
        return todos;
    } 
    if (id === "in-progress") {
        return inProgress
    }
    if (id === "completed") {
        return completed
    }
  }

  const reorderSection = (list: Card[] | undefined, startIndex: number, endIndex: number) => {
    const result = Array.from(list!);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
        switch (source.droppableId) {
            case "todos":
                updateTodos(reorderSection(todos, source.index, destination.index))
                console.log(todos)
                break
            case "in-progress":
                updateInProgress(reorderSection(inProgress, source.index, destination.index))
                console.log(inProgress)
                break
            case "completed":
                updateCompleted(reorderSection(completed, source.index, destination.index))
                console.log(completed)
                break
        }
    } 
  }

  return (
    <div>
      <div>{project.projectName}</div>
      <div>Project {projectId}</div>
      <div className={styles.container}>
          <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="todos">
                  {(provided) => 
                    <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                        <div>To Do</div>
                        {todos.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </div>
                  }
              </Droppable>
              <Droppable droppableId="in-progress">
                  {(provided) => 
                    <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                        <div>In Progress</div>
                        {inProgress.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </div>
                  }
              </Droppable>
              <Droppable droppableId="completed">
                  {(provided) => 
                    <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                        <div>Completed</div>
                        {completed.map((todo, index) => (
                            <TodoCard todo={todo} key={todo.id} index={index}/>
                        ))}
                        {provided.placeholder}
                    </div>
                  }
              </Droppable>
          </DragDropContext>
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


// const handleDragEnd = (result: any) => {
//     if (!result.destination) {
//         return;
//     }
//     const items = Array.from(todos);
//     const [reorderedItem] = items.splice(result.source.index, 1)
//     items.splice(result.destination.index, 0, reorderedItem)
//     updateTodos(items)
//   }
