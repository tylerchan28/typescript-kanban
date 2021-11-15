import { Droppable } from "react-beautiful-dnd";
import styles from "../styles/TodoCard.module.css";
import TodoCard from "./TodoCard";

type Props = {
    project_name: string
    list_id: number
    cards: any
}

function StatusList(props: Props) {
    return (
        <div>
            {/* <Droppable droppableId={props.project_name}>
                      {(provided) => 
                        <div className={styles.todos} {...provided.droppableProps} ref={provided.innerRef}>
                            <div>Completed</div>
                            {cards.map((todo, index) => (
                                <TodoCard todo={todo} key={todo.id} index={index}/>
                            ))}
                            {provided.placeholder}
                            nice
                        </div>
                      }
            </Droppable> */}
            this is a status list
        </div>
    )
}

// export const getServerSideProps = async (context: any) => {
//     // Within this list, GET all the cards associated with the list_id
//     // cards will be added to props and then mapped (maybe useState as well)
//     let client = new Client({
//         user: process.env.DB_USER,
//         database: process.env.DB_DATABASE,
//         password: process.env.DB_PASSWORD,
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         });  
//     client.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('connected to PostgreSQL');
//     }
//     });
//     let cards: any;
//     const getCards = new Promise((resolve, _) => {
//         resolve(client.query('SELECT * FROM cards WHERE list_id = ($1)', [context.list_id]));
//       })

//       await getCards
//       .then((results: any) => {
//         cards = results.rows
//         console.log("Cards: "+ cards)
//       })
//     return {
//       props: {
//         cards: cards
//       }
//     }


// }

export default StatusList


// map the todo cards under here (will then be called under [projectId].tsx)