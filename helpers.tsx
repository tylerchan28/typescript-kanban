import axios from "axios";
import { Card } from "./models/card-model";
import { List } from "./models/list-model";
export const onSave = (list: any) => {
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

  export const configureLists = (lists: List[]) => {
    let listMap: any = new Map;
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

  export const addCards = (map: any, cards: Card[]) => {
    for (let i in map) {
      let arr: Card[] = [];
      cards.forEach((card) => {
        parseInt(card.list_id) === map[i].listId && arr.push(card);
      });
      map[i].cardsArr = arr;
    }
    return map;
  };