import { useRouter } from "next/router";
import { useReducer, useCallback } from "react";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";
import { List } from "../../models/list-model";
import StatusList from "../../components/StatusList";
const { Client } = require("pg");
import produce from "immer";

interface Props {
  lists: List[]
  cards: Card[]
}

const dragReducer = produce((draft, action) => {
  switch (action.type) {
    case "MOVE": {
      draft[action.from] = draft[action.from] || [];
      draft[action.to] = draft[action.to] || [];
      const [removed] = draft[action.from].splice(action.fromIndex, 1);
      draft[action.to].splice(action.toIndex, 0, removed);
    }
  }
});

const Project = ({ cards, lists }: Props) => {
  const router = useRouter();
  const { projectId } = router.query;
  const [state, dispatch] = useReducer(dragReducer, {
    items: lists,
  });
  // // const [todo, updateTodo] = useState(project.todo)
  // // const [inProgress, updateInProgress] = useState(project.inProgress)
  // // const [completed, updateCompleted] = useState(project.completed)

  
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

  const handleDragEnd = useCallback((result) => {
    if (result.reason === "DROP") {
      if (!result.destination) {
        return;
      }
      dispatch({
        type: "MOVE",
        from: result.source.droppableId,
        to: result.destination.droppableId,
        fromIndex: result.source.index,
        toIndex: result.destination.index,
      });
    }
  }, []);

  return (
    <div>
      {/* <div>{project.project_name}</div> */}
      <div>Project {projectId}</div>
      <div className={styles.container}>
            {state.items.map((list: any) => (
             <DragDropContext onDragEnd={handleDragEnd}>
                <StatusList list_name={list.list_name} list_id={list.list_id} cards={cards} key={list.list_id}/>
             </DragDropContext>
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