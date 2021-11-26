import { useRouter } from "next/router";
import styles from "../../styles/project.module.css";
import { Project } from "../../models/project-model";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";
import { List } from "../../models/list-model";
import StatusList from "../../components/StatusList";
const { Client } = require("pg");
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { onSave, configureLists, addCards } from "../../helpers";
interface Props {
  lists: List[];
  cards: Card[];
}

interface StatusList {
  cardsArr: Card[];
  droppableId: number;
  listId: number;
  listName: string;
  entries: any
}

interface IStatusList {
  [key: string]: StatusList
}

function Project({ cards, lists }: Props) {
  const router = useRouter();
  const { projectId } = router.query;
  const [statusLists, setStatusLists] = useState<IStatusList>({});
  const [addCardForm, showAddCardForm] = useState(false);
  const cardDescriptionRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let mapWithCardArr = configureLists(lists);
    setStatusLists(addCards(mapWithCardArr, cards));
  }, []);

  const onAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedCard: Card = ({
      list_id: statusLists[0].listId,
      card_description: cardDescriptionRef.current!.value,
      card_id: Math.random()
    });
    
    axios.post("http://localhost:3000/add-card", submittedCard, {headers: {
      'Content-Type': 'application/json'
    }}).then((res) => {
      submittedCard.card_id = res.data;
      statusLists[0].cardsArr.push(submittedCard)
      cardDescriptionRef.current!.value = "";
    showAddCardForm(false);
    });
  }

  const onDeleteCard = (card_id: number, list_id: number) => {
    console.log(card_id)
    console.log(list_id)
    let matchedList: any;
    // access the card's list and splice it out
    for (let i in statusLists) {
      if (statusLists[i].listId === list_id) {
        matchedList = statusLists[i];
        break;
      }
    }
    let matchedCardsArr = matchedList.cardsArr;
    let deletedCardArr = matchedCardsArr.filter((card: Card) => card.card_id !== card_id)
    setStatusLists({
      ...statusLists,
      [list_id]: {
        ...matchedList,
        cardsArr: deletedCardArr
      }
    })
    axios.delete("/delete-card", { data: { card_id: card_id }})
  }


  const onDragEnd = (result: any, statusLists: any, setStatusLists: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // Front end moving
    if (source.droppableId === destination.droppableId) {
      const list = statusLists[source.droppableId];
      const copiedItems = [...list.cardsArr];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setStatusLists({
        ...statusLists,
        [source.droppableId]: {
          ...list,
          cardsArr: copiedItems,
        },
      });
    } else {
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
          cardsArr: sourceCards,
        },
        [destination.droppableId]: {
          ...destList,
          cardsArr: destCards,
        },
      });
    }
  };

  return (
    <div>
      <div>Project {projectId}</div>
      <button onClick={() => onSave(statusLists)}>Save Card Order</button>
      <button onClick={() => showAddCardForm(!addCardForm)}>Add Card</button>
      { addCardForm && 
        <form onSubmit={onAddCard}>
          <input
            type="text"
            ref={cardDescriptionRef}
          />
          <button type="submit">Add</button>
        </form>
      }
      <div className={styles.container}>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, statusLists, setStatusLists)}
        >
          {Object.values(statusLists).map((statusList: any, index: number) => (
            <StatusList
              list_name={statusList.listName}
              key={statusList.listId}
              cards={statusList.cardsArr}
              list_id={statusList.listId}
              index={index}
              deleteCard={onDeleteCard}
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
