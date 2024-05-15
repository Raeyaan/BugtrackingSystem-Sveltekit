import type { ObjectId } from "mongodb";

export interface AgendaData {
    _id: string
    created_by: string;
    name: string;
    description: string;
    created: Date;
    completed: boolean;
    tag: string;
    progress: string;
}


export class User {
    constructor(public username: string, public password: string, public _id?: ObjectId) { }
}

export class Agenda {
    constructor(public _id: ObjectId, public created_by: string, public name: string, public description: string, public created: Date, public completed: boolean, public tag: string, public progress: string) { }
}
