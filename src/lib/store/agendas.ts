import type { AgendaData } from "$lib/types/types";

import { writable } from "svelte/store";

export const agendas = writable(Array<AgendaData>())
