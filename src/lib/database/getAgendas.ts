import { DB_NAME, DB_AGENDA_COLL } from "$env/static/private"
import { toData } from "$lib/helpers/toData"
import type { Agenda, AgendaData } from "$lib/types/types"
import type { ServerLoadEvent } from "@sveltejs/kit"
import { getClient } from "./client"

export const getAgendas = async (event: ServerLoadEvent) => {
    const { locals } = event

    const username = locals.username
    const query = {
        created_by: username
    }

    try {
        const client = await getClient()
        const agendaResult = await client.db(DB_NAME).collection<Agenda>(DB_AGENDA_COLL).find<Agenda>(query).toArray()
        await client.close()
        const userAgendas: AgendaData[] = agendaResult.map((agenda) => toData(agenda))
    
        return { userAgendas }
    } catch (error) {
        console.log("Err - ", error)
        return { userAgendas: [], errorMsg: "Error retrieving agendas, please try again later." }
    }
}