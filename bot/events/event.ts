import type { NewClient } from "../../index.js"

type Event = (client: NewClient) => void

export type {
	Event
}

