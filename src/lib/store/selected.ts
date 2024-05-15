import type { AgendaData } from "$lib/types/types";
import { writable } from "svelte/store";

export const selectedAgenda = writable<AgendaData|null>(null)