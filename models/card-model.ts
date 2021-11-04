export enum Status { Todo, InProgress, Completed }

export interface Card {
    id: number,
    description: string,
    status: string
}

// change ids to string (numbers now to use with fixture)