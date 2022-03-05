import { ItemList } from "./items.js"
import db = require("quick.db")

type Inventory = { [key in ItemList]: number }
const userDefaults = {
    inventory: <Inventory>{
        gem: 5
    }
}
class User {
    id: string
    inventory: Inventory
    constructor(
        id: string,
        data?: {
            id: string,
            inventory: Inventory
        }
    ) {
        if (data) {
            Object.keys(data).forEach(key => {
                if (!(key in userDefaults)) {
                    delete data[key]
                    return
                }
            })
            Object.keys(userDefaults).forEach(key => {
                if (!(key in data)) {
                    data[key] = userDefaults[key]
                }
            })

            Object.keys(data).forEach(key => {
                this[key] = userDefaults[key]
            })
            return
        }

        this.id = id
        Object.keys(userDefaults).forEach(key => {
            this[key] = userDefaults[key]
        })
    }

    save() {
        db.set(`users.${this.id}`, JSON.stringify(this))
    }

    static load(id: string) {
        const raw = db.get(`users.${id}`)
        if (!raw) return null
        return new User("", JSON.parse(raw))
    }
}

const test = () => {
    console.log("Testing...\n")

    // Testing user with missing attributes
    const missingTest = {
        id: "missing",
    }
    db.set(`users.missing`, JSON.stringify(missingTest))
    console.log("User.load(\"missing\")", User.load("missing"))

    // Testing user with extra attributes
    const extraTest = {
        id: "extra",
        extra: true,
        extraAgain: "extra attribute",
        inventory: {
            gem: 5
        }
    }
    db.set(`users.extra`, JSON.stringify(extraTest))
    console.log("User.load(\"extra\")", User.load("extra"))

    // Testing user with good attributes
    const goodTest = {
        id: "good",
        inventory: {
            gem: 5
        }
    }
    db.set(`users.good`, JSON.stringify(goodTest))
    console.log("User.load(\"good\")", User.load("good"))

    console.log("Done testing")
}

test()

export {
    User
}