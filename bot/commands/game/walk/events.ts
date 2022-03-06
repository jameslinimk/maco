import type { GuildMember } from "discord.js"
import { random } from "../../../ts/globalFunctions.js"

interface Event {
    /**
     * Amount of money the user will get
     */
    money: [number, number]
    /**
     * Probability of this item being selected
     */
    weight: number
    /**
     * Custom variables:
     *  - `{user}` | Username
     *  - `{tag}` | Tag
     *  - `{mention}` | Mention
     *  - `{money}` | Amount of money gotten
     */
    messages: string[]
}

const events: Event[] = [
    {
        money: [2, 10],
        weight: 10,
        messages: ["{user} found {money} while going on a walk."]
    },
    {
        money: [100, 200],
        weight: 1,
        messages: ["🎉 JACKPOT! {user} found {money} !"]
    }
]

const randomEvent = () => {
    let total = 0
    for (let i = 0; i < events.length; ++i) {
        total += events[i].weight
    }

    const threshold = Math.random() * total

    total = 0
    for (let i = 0; i < events.length - 1; ++i) {
        total += events[i].weight

        if (total >= threshold) {
            return events[i]
        }
    }

    return events[events.length - 1]
}

const parseEvent = (event: Event, user: GuildMember) => {
    const message = event.messages[Math.floor(Math.random() * event.messages.length)]
    const money = random(event.money[0], event.money[1])

    message.replaceAll("{user}", `${user.displayName}`)
    message.replaceAll("{tag}", `${user.user.tag}`)
    message.replaceAll("{mention}", `${user}`)
    message.replaceAll("{money}", `${money}`)

    return { message, money }
}

const test = () => {
    const messages = {}
    for (let i = 0; i < 100000; i++) {
        const event = randomEvent()
        if (!messages[event.messages[0]]) messages[event.messages[0]] = 0
        messages[event.messages[0]] += 1
    }
    console.log(messages)
}
// test()

export {
    events,
    randomEvent,
    parseEvent
}