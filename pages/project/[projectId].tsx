import { useRouter } from "next/router";
import styles from "../../styles/Project.module.css";
import { Project } from "../../models/project-model";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import { Card } from "../../models/card-model";
import { List } from "../../models/list-model";
import StatusList from "../../components/StatusList";
const { Client } = require("pg");
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { onSave, configureLists, addCards } from "../../helpers";
import { Save, X } from "react-feather";
interface Props {
  lists: List[];
  cards: Card[];
  projectName: string;
}

interface StatusList {
  cardsArr: Card[];
  droppableId: number;
  listId: number;
  listName: string;
  entries: any;
}

interface IStatusList {
  [key: string]: StatusList;
}

function Project({ cards, lists, projectName }: Props) {
  const router = useRouter();
  const { projectId } = router.query;
  const [statusLists, setStatusLists] = useState<IStatusList>({});
  const [addListForm, showAddListForm] = useState(false);
  const listTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mapWithCardArr = configureLists(lists);
    setStatusLists(addCards(mapWithCardArr, cards));
  }, []);

  const onAddCard = (list_id: number, card_description: string) => {
    const submittedCard: Card = {
      list_id: list_id,
      card_description: card_description,
      card_id: Math.random(),
    };
    axios
      .post("http://localhost:3000/add-card", submittedCard, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        submittedCard.card_id = res.data;
        setStatusLists({
          ...statusLists,
          [list_id]: {
            ...statusLists[list_id],
            cardsArr: [...statusLists[list_id].cardsArr, submittedCard]
          }
        })
      });
  };
  const onDeleteCard = (card_id: number, list_id: number) => {
    let matchedList: any;
    for (let i in statusLists) {
      if (statusLists[i].listId === list_id) {
        matchedList = statusLists[i];
        break;
      }
    }
    let matchedCardsArr = matchedList.cardsArr;
    let deletedCardArr = matchedCardsArr.filter(
      (card: Card) => card.card_id !== card_id
    );
    setStatusLists({
      ...statusLists,
      [list_id]: {
        ...matchedList,
        cardsArr: deletedCardArr,
      },
    });
    axios.delete("/delete-card", { data: { card_id: card_id } });
  };

  const onEditCard = (
    card_id: number,
    list_id: number,
    description: string
  ) => {
    let matchedList: any;
    for (let i in statusLists) {
      if (statusLists[i].listId === list_id) {
        matchedList = statusLists[i];
        break;
      }
    }
    let matchedCardsArr = matchedList.cardsArr;
    for (let i = 0; i < matchedCardsArr.length; i++) {
      if (matchedCardsArr[i].card_id === card_id) {
        matchedCardsArr[i].card_description = description;
      }
    }
    setStatusLists({
      ...statusLists,
      [list_id]: {
        ...matchedList,
        cardsArr: matchedCardsArr,
      },
    });
    axios
      .put("/edit-card", { card_id, card_description: description })
      .then(() => onSave(statusLists));
  };
  const onAddList = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedList: any = {
      listId: Math.random(),
      listName: listTitleRef.current!.value,
      projectId: +projectId!,
    };
    axios.post("/add-list", submittedList).then((res) => {
      submittedList.cardsArr = [];
      submittedList.droppableId = res.data;
      submittedList.listId = res.data;
      setStatusLists({
        ...statusLists,
        [res.data]: submittedList,
      });
      listTitleRef.current!.value = "";
      showAddListForm(false);
    });
  };

  const onDeleteList = (list_id: number) => {
    let statusListsCopy: any = {};
    for (let i in statusLists) {
      if (statusLists[i].listId !== list_id) {
        statusListsCopy[statusLists[i].listId] = statusLists[i];
      }
    }
    setStatusLists(statusListsCopy);
    axios
      .delete("/delete-list", { data: { list_id: list_id } })
      .then((res) => console.log(res));
  };

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
      <div className={styles.info}> 
        <div className={styles.project_name}>{projectName}</div>
        <div className={styles.button_container}>
          {lists.length > 0 && (
          <div className={styles.button_text}>
            <button className={styles.button} onClick={() => onSave(statusLists)}>
              <Save color="gray" size={20} />
            </button>
            <div >(Save Order)</div>
          </div> 
          )}
            <button className={styles.button} onClick={() => showAddListForm(!addListForm)}>
              <span className={styles.list_add_button}> Add a List</span>
            </button>
        </div>
      </div>
      <div className={styles.dnd_container}>
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
              addCard={onAddCard}
              deleteCard={onDeleteCard}
              editCard={onEditCard}
              deleteList={onDeleteList}
            />
          ))}
           {addListForm && (
        <form className={styles.list_form} onSubmit={onAddList}>
          <input className={styles.list_form_input} type="text" ref={listTitleRef} placeholder="Enter a list title..." />
          <div className={styles.form_button_container}>
            <button className={styles.list_add_button} type="submit">Add List</button>
            <button className={styles.list_cancel_button} onClick={() => showAddListForm(false)}><X color="gray" size={20}/></button>
          </div>
        </form>
      )}
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

  let lists, cards, projectName;
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

  const getTitle = new Promise((resolve, reject) => {
    resolve(
      client.query("SELECT project_name FROM projects WHERE project_id = ($1)",
        [context.query.projectId]
      )
    )
  })

  await getTitle.then((results: any) => {
    projectName = results.rows[0].project_name;
  })

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
      lists,
      cards,
      projectName
    },
  };
};

export default Project;
