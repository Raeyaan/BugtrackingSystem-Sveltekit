import { DB_NAME, DB_AGENDA_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import type { Agenda } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const updateAgendaCompleted = async (event: RequestEvent) => {
    const { request } = event

    const data = await request.formData()

    const id = data.get("id") as string
    const index = data.get('index') as string
    const completed = data.get('completed') === 'true'

    const filter = { _id: new ObjectId(id) }
    const newVals = { $set: {completed} }

    try {        
        const client = await getClient()
        const agendasCollection = client.db(DB_NAME).collection<Agenda>(DB_AGENDA_COLL)
        const result = await agendasCollection.updateOne(filter, newVals)
        await client.close()
    
        return result?.acknowledged ? {index} : fail(400, {errorMsg: "Failed to update, please try again later", index})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to update, please try again later", index})
    }
}