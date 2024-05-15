import type { Actions, PageServerLoad } from "../$types";
import { createAgenda } from "$lib/database/createAgenda";
import { deleteAgenda } from "$lib/database/deleteAgenda";
import { getAgendas } from "$lib/database/getAgendas";
import { updateAgenda } from "$lib/database/updateAgenda";
import { updateAgendaCompleted } from "$lib/database/updateAgendaCompleted";

export const load: PageServerLoad = async (event) => {
    return getAgendas(event)
}

export const actions: Actions = {
    create: async (event) => {
        return createAgenda(event)
    },

    update: async (event) => {
        return updateAgenda(event)
    },

    updateCompleted: async (event) => {
        return updateAgendaCompleted(event)
    },

    delete: async (event) => {
        return deleteAgenda(event)
    }
};