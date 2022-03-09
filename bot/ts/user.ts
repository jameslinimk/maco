import { ItemList } from "./items.js"
import db = require("quick.db")

type Inventory = { [key in ItemList]: number }
type SingularMoneyHistory = { money: number, reason: string, time: number }
type MoneyHistory = SingularMoneyHistory[]
const userDefaults = {
    inventory: <Inventory>{ gem: 5 },
    moneyHistory: <MoneyHistory>[]
}
class User {
    id: string
    inventory: Inventory
    moneyHistory: MoneyHistory
    constructor(
        id: string,
        data?: {
            id: string,
            inventory: Inventory,
            moneyHistory: MoneyHistory
        }
    ) {
        if (data) {
            this.id = data.id

            Object.keys(data).forEach(key => {
                if (!(key in userDefaults)) {
                    delete data[key]
                    return
                }
            })

            Object.keys(userDefaults).forEach(key => {
                if (!(key in data)) {
                    console.log("overrode", key)
                    data[key] = userDefaults[key]
                }
            })

            Object.keys(data).forEach(key => {
                this[key] = data[key]
            })
            return
        }

        this.id = id
        Object.keys(userDefaults).forEach(key => {
            this[key] = userDefaults[key]
        })
    }

    get money() {
        return this.inventory.gem || 0
    }

    set money(money: number) {
        this.invSet("gem", money)
    }

    invAdd(item: ItemList, amount = 1) {
        if (!this.inventory[item]) this.inventory[item] = 0
        this.inventory[item] += amount
    }

    invGet = (item: ItemList) => this.inventory[item] || 0
    invSet = (item: ItemList, amount: number) => this.inventory[item] = amount

    save() {
        db.set(`users.${this.id}`, this)
    }

    static load(id: string) {
        const data = db.get(`users.${id}`)
        if (!data) return null
        return new User("", data)
    }
}

const test = () => {
    console.log("Testing...\n")

    // Testing user with missing attributes
    const missingTest = {
        id: "missing",
    }
    db.set(`users.missing`, missingTest)
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
    db.set(`users.extra`, extraTest)
    console.log("User.load(\"extra\")", User.load("extra"))

    // Testing user with good attributes
    const goodTest = {
        id: "good",
        inventory: {
            gem: 5
        }
    }
    db.set(`users.good`, goodTest)
    console.log("User.load(\"good\")", User.load("good"))

    console.log("Done testing")

    const testUser = new User("amongus")
    testUser.save()

    console.log(User.load("amongus"))
}

// test()

export {
    User
}

export type {
    Inventory,
    SingularMoneyHistory,
    MoneyHistory
}