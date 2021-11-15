import { useRouter } from "next/router";
import { useState } from "react";
import projectFixture from "../../fixtures/projectExample";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import TodoCard from "../../components/TodoCard";
import { DragDropContext, DraggableLocation, Droppable, DropResult, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";
import { List } from "../../models/list-model";
import StatusList from "../../components/StatusList";
const { Client } = require("pg");


interface Props {
  lists: List[]
  cards: Card[]
}

const Project = ({ cards, lists }: Props) => {
  const router = useRouter();
  const { projectId } = router.query;
  // const [todos, updateTodos] = useState(project.todo)
  // const [inProgress, updateInProgress] = useState(project.inProgress)
  // const [completed, updateCompleted] = useState(project.completed)

  // const getList = (id: string) => {
  //   if (id === "todos") {
  //       return todos;
  //   } 
  //   if (id === "in-progress") {
  //       return inProgress
  //   }
  //   if (id === "completed") {
  //       return completed
  //   }
  // }
  
  // const reorderSection = (list: Card[] | undefined, startIndex: number, endIndex: number) => {
  //   const result = Array.from(list!);
  //   const [removed] = result.splice(startIndex, 1);
  //   result.splice(endIndex, 0, removed);
  //   return result;
  // }

  // const move = (source: Card[] | undefined, destination: Card[] | undefined, droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  //   const sourceClone = Array.from(source!);
  //   const destinationClone = Array.from(destination!);
  //   const [removed] = sourceClone.splice(droppableSource.index, 1);

  //   destinationClone.splice(droppableDestination.index, 0, removed);

  //   const result: any = {};
  //   result[droppableSource.droppableId] = sourceClone;
  //   result[droppableDestination.droppableId] = destinationClone;
  //   return result;
  // }
// After every change, don't forget to update in the database
  // const handleDragEnd = (result: DropResult) => {
  //   const { destination, source } = result;
  //   if (!destination) return;
  //   if (source.droppableId === destination.droppableId) {
  //       switch (source.droppableId) {
  //           case "todos":
  //               updateTodos(reorderSection(todos, source.index, destination.index))
  //               break
  //           case "in-progress":
  //               updateInProgress(reorderSection(inProgress, source.index, destination.index))
  //               break
  //           case "completed":
  //               updateCompleted(reorderSection(completed, source.index, destination.index))
  //               break
  //       }
  //   } else {
  //       const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination)
        
        
        
  //       const newTodos = result.todos ? result.todos : undefined;
  //       const newInProgress = result["in-progress"] ? result["in-progress"] : undefined;
  //       const newCompleted = result.completed ? result.completed : undefined;
  //       if (newTodos === undefined) {
  //           updateInProgress(newInProgress);
  //           updateCompleted(newCompleted);
  //       } else if (newInProgress === undefined) {
  //           updateTodos(newTodos);
  //           updateCompleted(newCompleted);
  //       } else if (newCompleted === undefined) {
  //           updateTodos(newTodos);
  //           updateInProgress(newInProgress)
  //       }
  //   } 
  // }

  return (
    <div>
      {/* <div>{project.project_name}</div> */}
      {console.log(lists)}
      <div>Project {projectId}</div>
      <div className={styles.container}>
            {lists.map((list: any) => (
             <div>
                <StatusList list_name={list.list_name} list_id={list.list_id} cards={cards} key={list.list_id}/>
             </div>
            ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  resetServerContext()
  let client = new Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  });  
  client.connect((err: Error) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to PostgreSQL');
    }
  });

  let lists, cards;
  let listIds: any = [];
  const getLists = new Promise((resolve, reject) => {
    resolve(client.query('SELECT * FROM lists WHERE project_id = ($1)', [context.query.projectId]))
  })

  await getLists
    .then((results: any) => {
      lists = results.rows
      lists.forEach((list: any) => listIds.push(+list.list_id))
    })
  const getCards = new Promise((resolve, reject) => {
    resolve(client.query('SELECT * FROM cards WHERE list_id = ANY($1::int[])', [listIds]))
  })

  await getCards 
    .then((results: any) => {
      cards = results.rows;
    })
  return {
    props: {
      lists: lists,
      cards: cards
    }
  }
};
// make new list component
// in here, GET lists that correspond to the project id
// THEN (in another component) get cards that correspond to the list id
// finally, add logic for moving cards

export default Project;

// DragDropContext onDragEnd={handleDragEnd}>
//               {/* Each droppable should become its own list component with a name */}
//               {/* Map out ALL lists here (add a max amount?)*/}
//               <Droppable droppableId="todos">
//                   {(provided) => 
//                     <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
//                         <div>To Do</div>
//                         {provided.placeholder}
//                     </div>
//                   }
//               </Droppable>
//               <Droppable droppableId="in-progress">
//                   {(provided) => 
//                     <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
//                         <div>In Progress</div>
//                         {provided.placeholder}
//                     </div>
//                   }
//               </Droppable>
//               <Droppable droppableId="completed">
//                   {(provided) => 
//                     <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
//                         <div>Completed</div>
//                         {completed.map((todo, index) => (
//                             <TodoCard todo={todo} key={todo.id} index={index}/>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                   }
//               </Droppable>
//           </DragDropContext>