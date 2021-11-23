import { useRouter } from "next/router";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";
import { List } from "../../models/list-model";
import StatusList from "../../components/StatusList";
const { Client } = require("pg");
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  lists: List[];
  cards: Card[];
}

interface StatusList {
  cardsArr: Card[];
  droppableId: number;
  listId: number;
  listName: string;
}

function Project({ cards, lists }: Props) {
  const router = useRouter();
  const { projectId } = router.query;
  const [statusLists, setStatusLists] = useState({});

  useEffect(() => {
    const configureLists = (lists: List[]) => {
      let listMap: any = {};
      lists.forEach(
        (list: List, index: number) =>
          (listMap[index] = {
            cardsArr: [],
            droppableId: index,
            listId: list.list_id,
            listName: list.list_name,
          })
      );
      return listMap;
    };

    const addCards = (map: any) => {
      for (let i in map) {
        let arr: Card[] = [];
        cards.forEach((card) => {
          parseInt(card.list_id) === map[i].listId && arr.push(card);
        });
        map[i].cardsArr = arr;
      }
      return map;
    };
    let mapWithCardArr = configureLists(lists);
    setStatusLists(addCards(mapWithCardArr));
  }, []);

  const onSave = (list: any) => {
    const saveArr = [];
    for (let i in list) {
      saveArr.push(list[i]);
    }    
    saveArr.forEach((list: any) => {
      list.cardsArr.forEach(async (card: Card) => {
        await axios.put("/update-list-id", {
          new_list_id: card.list_id,
          card_id: card.card_id
        })
      })
    })
  }


  const onDragEnd = (
    result: any,
    statusLists: any,
    setStatusLists: any
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // Front end moving
    if (source.droppableId === destination.droppableId) {
      const list = statusLists[source.droppableId];
      const copiedItems = [...list.cardsArr];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      let copiedLists = statusLists;
      copiedLists[source.droppableId] = { ...list, cardsArr: copiedItems };
      setStatusLists({
        ...statusLists,
        [source.droppableId]: {
          ...list,
          cardsArr: copiedItems,
        },
      });
      console.log(statusLists)
    } else {
      // Front end moving
      const sourceList = statusLists[source.droppableId];
      const destList = statusLists[destination.droppableId];
      const sourceCards = [...sourceList.cardsArr];
      const destCards = [...destList.cardsArr];
      const [removed] = sourceCards.splice(source.index, 1);
      removed.list_id = destList.listId;
      destCards.splice(destination.index, 0, removed);

      setStatusLists({
        ...statusLists,
        [source.droppableId]: {
          ...sourceList,
          cardsArr: sourceCards
        },
        [destination.droppableId]: {
          ...destList,
          cardsArr: destCards
        },
      });
      ;
    }
  };

  return (
    <div>
      <div>Project {projectId}</div>
      <button onClick={() => onSave(statusLists)}>Save</button>
      <div className={styles.container}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, statusLists, setStatusLists)}
        >
          {Object.values(statusLists).map((statusList: any, index: number) => (
            <StatusList
              list_name={statusList.listName}
              key={statusList.listId}
              cards={statusList.cardsArr}
              index={index}
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  resetServerContext();
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
      console.log("connected to PostgreSQL");
    }
  });

  let lists, cards;
  let listIds: any = [];
  const getLists = new Promise((resolve, reject) => {
    resolve(
      client.query("SELECT * FROM lists WHERE project_id = ($1)", [
        context.query.projectId,
      ])
    );
  });

  await getLists.then((results: any) => {
    lists = results.rows;
    lists.forEach((list: any) => listIds.push(+list.list_id));
  });
  const getCards = new Promise((resolve, reject) => {
    resolve(
      client.query("SELECT * FROM cards WHERE list_id = ANY($1::int[])", [
        listIds,
      ])
    );
  });

  await getCards.then((results: any) => {
    cards = results.rows;
  });
  return {
    props: {
      lists: lists,
      cards: cards,
    },
  };
};

export default Project;
