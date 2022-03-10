import { once } from "events"
import { TypedEmitter } from "tiny-typed-emitter"
import { wait } from "../../../../ts/globalFunctions.js"

class _PendingRps {
    pending: Map<string, string>

    constructor() {
        this.pending = new Map()
    }

    /**
     * @param home Player that started the rps
     * @param away Player that is pending the rps
     */
    add(home: string, away: string) {
        this.pending.set(away, home)
    }

    /**
     * @param user Player that is accepting the rps
     */
    play(user: string) {
        const pending = this.pending.get(user)
        if (!pending) return "No game"


    }
}

interface PendingRpsEvents {
    "ready": (home: string) => void
}

class PendingRps extends TypedEmitter<PendingRpsEvents> {
    pending: Map<string, string>
    playersWithHome: Set<string>

    constructor() {
        super()
        this.pending = new Map()
        this.playersWithHome = new Set()
    }

    /**
     * @param home Player that started the rps
     * @param away Player that is pending the rps
     */
    add(home: string, away: string) {
        this.pending.set(away, home)
        this.playersWithHome.add(home)

        console.log("A new game was created with", home, "and", away)
    }

    checkHome = (home: string) => this.playersWithHome.has(home)
    checkAway = (away: string) => this.pending.has(away)

    async awaitReady(home: string, away: string) {
        if (!this.checkHome(home)) return

        const started = Date.now()
        const maxTime = 15000

        while (true) {
            const result = await Promise.race([
                once(this, "ready"),
                wait(maxTime - (Date.now() - started))
            ])

            if (result === "wait") {
                console.log("return timeout")
                return "timeout"
            }

            console.log(result)

            // TODO continue working on this system. return timeout works
        }
    }

    /**
     * @param away Player that is accepting the rps
     */
    ready(away: string) {
        const pending = this.pending.get(away)
        if (!pending) return "no game"

        this.emit("ready", pending)
        console.log(away, "accepted")
    }
}

const pendingRps = new PendingRps()

export default pendingRps

export type {
    PendingRps
}

