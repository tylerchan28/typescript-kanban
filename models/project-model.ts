import { Card } from "./card-model";

export type Project = {
    project_id: number,
    user_id: number,
    project_name: string,
    // todo: Card[],
    // inProgress: Card[],
    // completed: Card[]
}

// change ids to string (numbers now to use with fixture)