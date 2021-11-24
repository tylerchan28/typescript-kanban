export enum Status { Todo, InProgress, Completed }

export interface Card {
    card_id?: number,
    card_description: string,
    list_id: number
}

// change ids to string (numbers now to use with fixture)