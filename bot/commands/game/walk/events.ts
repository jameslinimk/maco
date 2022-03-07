import type { GuildMember } from "discord.js"
import { formatMoney, random } from "../../../ts/globalFunctions.js"

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
     *  - `{person}` | A random person
     *  - `{place}` | A random place
     */
    messages: string[]
}

const randomPlaces = ["McDonalds", "your moms house", "your dads house", "the White House", "Subway", "Wendys", "Taco Bell", "CVS", "Wallgreens", "Joes Bagels", "Joes Juices", "Joes Pizza", "Joes house", "Home Depot", "Lowes", "Walmart", "Target", "Starbucks"]
const randomPeople = ["Joe Biden", "Donald Trump", "your mom", "your dad", "your sister", "your brother", "dream", "a dream stan", "bob", "Rasputin", "Opera", "Beyoncé", "Dwayne Johnson", "the Rock", "John Cina", "Zhong Xina", "Will Smith", "Jayden Smith", "Eminem", "Robert Downy Jr.", "Justin Bieber", "Barack Obama", "Jeff Bezos", "Elon Musk", "Mark Zuckerberg", "Isaac Newton", "Jesus", "God", "the Buddha", "Taylor Swift", "Selena Gomez", "Kendall Jenner", "Madonna", "Gandhi", "Logan Paul", "Jake Paul", "Conner McGregor", "Floyd Mayweather", "Tom Brady", "Holdin Tudix", "Ray Piste", "Justin Hurass", "Ben Dover", "Confucius", "Christopher Columbus", "Albert Einstein"]

const events: Event[] = [
    {
        money: [2, 10],
        weight: 10,
        messages: [
            "{user} found {money} while going on a walk.",
            "While walking back from {place}, {user} found {money}",
            "{user} stole {money} from a {person}'s purse",
            "While walking back from {place}, {user} robbed {person} for {money}",
            "While in {place}, {user} killed {person} and stole {money}",
            "{user} took pictures of {person}'s feet for {money}"
        ]
    },
    {
        money: [1000, 2000],
        weight: 0.1,
        messages: ["🎉 JACKPOT! {user} won the lottery for {money} !"]
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
    const money = random(event.money[0], event.money[1])
    const message = event.messages[Math.floor(Math.random() * event.messages.length)]
        .replaceAll("{user}", `${user.displayName}`)
        .replaceAll("{tag}", `${user.user.tag}`)
        .replaceAll("{mention}", `${user}`)
        .replaceAll("{money}", `[${formatMoney(money)}](https://example.com/)`)
        .replaceAll("{place}", `*${randomPlaces[Math.floor(Math.random() * randomPlaces.length)]}*`)
        .replaceAll("{person}", `*${randomPeople[Math.floor(Math.random() * randomPeople.length)]}*`)

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