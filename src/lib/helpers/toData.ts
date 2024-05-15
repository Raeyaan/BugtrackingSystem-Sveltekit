import type { Agenda } from "$lib/types/types"

export const toData = (agenda: Agenda) => {
    return {
        ...agenda,
        _id: agenda._id.toString(),
    }
}