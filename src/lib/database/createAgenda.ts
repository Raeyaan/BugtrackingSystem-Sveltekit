import { DB_NAME, DB_AGENDA_COLL } from "$env/static/private"
import type { RequestEvent } from "../../routes/$types";
import { Agenda } from "$lib/types/types.js";
import { ObjectId } from "mongodb";
import { getClient } from "./client";
import { fail } from "@sveltejs/kit";

export const createAgenda = async (event: RequestEvent) => {
    const { request, locals } = event

    const username = locals.username
    const data = await request.formData()

    const name = data.get('name') as string
    const description = data.get('description') as string
    const tag = data.get('tag') as string
    const progress = data.get('progress') as string

    if (!name) return fail(400, {errorMsg: "Your agenda cannot have an empty name."})
    if (parseInt(progress)>100 || parseInt(progress)<0 ) return fail(400, {errorMsg: "Your progress is more than 100 or less than 0."})
    if (name.length > 50) return fail(400, {errorMsg: "Name must be less than or equal to 50 characters"})
    if (!description) return fail(400, {errorMsg: "Your agenda cannot have an empty description."})
    if (description.length > 400) return fail(400, {errorMsg: "Description must be less than or equal to 400 characters"})

    const completed = false;

    const created = new Date()

    const newAgenda = new Agenda(new ObjectId(), username, name, description, created, completed, tag, progress)

    try {
        const client = await getClient()
        const agendasCollection = client.db(DB_NAME).collection<Agenda>(DB_AGENDA_COLL)
        const insertAgenda = await agendasCollection.insertOne(newAgenda)
        await client.close()

        return insertAgenda.acknowledged ? {} : fail(400, {errorMsg: "Failed to create, please try again later"})
    } catch (error) {
        console.log("Err - ", error)
        return fail(400, {errorMsg: "Failed to create, please try again later"})
    }

}