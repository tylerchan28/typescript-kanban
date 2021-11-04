import { Card } from "./card-model";

export type Project = {
    projectId: number;
    userId: number;
    projectName: string;
    todo: Card[],
    inProgress: Card[],
    completed: Card[]
}

// change ids to string (numbers now to use with fixture)