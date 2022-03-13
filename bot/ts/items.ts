import { capital, formatMoney } from "./globalFunctions.js"

enum ItemType {
    "collectable"
}
enum Rarities {
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "unique",
    "godly"
}

interface Item {
    icon: string
    buyable: boolean
    value: number
    sellable: boolean
    sellValue?: number
    type: ItemType
    rarity: Rarities
    description: string
}

const itemList = <const>["gem", "test", "nonBuyable", "nonSellable", "nonObtainable"]
type ItemList = typeof itemList[number]
const _items = <{ [key in ItemList]: Item }>{
    gem: {
        icon: "💎",
        buyable: false,
        value: 1,
        sellable: false,
        type: ItemType.collectable,
        rarity: Rarities.common,
        description: "A gem collected from the deep mines. Been the most stable currency since 103BC"
    },
    test: {
        icon: "📰",
        buyable: true,
        value: 12,
        sellable: true,
        sellValue: 13,
        type: ItemType.collectable,
        rarity: Rarities.godly,
        description: "A testing item"
    },
    nonBuyable: {
        icon: "⛔",
        buyable: false,
        value: 11,
        sellable: true,
        sellValue: 41,
        type: ItemType.collectable,
        rarity: Rarities.uncommon,
        description: "A testing item that is not buyable"
    },
    nonSellable: {
        icon: "🤣",
        buyable: true,
        value: 4,
        sellable: false,
        sellValue: 95,
        type: ItemType.collectable,
        rarity: Rarities.epic,
        description: "A testing item that is not sellable"
    },
    nonObtainable: {
        icon: "💵",
        buyable: false,
        value: 69,
        sellable: false,
        sellValue: 420,
        type: ItemType.collectable,
        rarity: Rarities.rare,
        description: "A testing item that is not sellable or buyable"
    }
}
export default _items
// TODO Change later ^^

// TODO find a use for this. Too long for small devices
// const formatItemList = (items: ItemList[], options: { [key in typeof formatOptions[number]]?: boolean }) => {
//     formatOptions.forEach(key => {
//         if (!(key in options)) {
//             options[key] = true
//         }
//     })

//     const longestOptions: { [key: number]: number } = {}
//     const returnArray = [
//         Object.keys(options).filter(key => options[key]).map(key => {
//             return capital(key.split("").map(letter => {
//                 if (letter.toUpperCase() === letter) return ` ${letter}`
//                 return letter
//             }).join("") + ":")
//         }).filter(v => v)
//     ]

//     returnArray[1] = []
//     returnArray[0].forEach((value, i) => {
//         returnArray[1][i] = ""
//         if (!value) return
//         longestOptions[i] = value.length
//     })

//     items.forEach(key => {
//         const item = _items[key]
//         const array: string[] = []

//         const checkNPush = (key: number, value: string) => {
//             array.push(value)
//             if (!longestOptions[key] || value.length > longestOptions[key]) longestOptions[key] = value.length
//         }

//         let i = 0
//         Object.keys(options).forEach(optKey => {
//             if (!options[optKey]) return
//             switch (optKey) {
//                 case "name":
//                     checkNPush(i, `${capital(key)}`)
//                     break
//                 case "rarity":
//                     checkNPush(i, capital(Rarities[item.rarity]) + ` (${item.rarity})`)
//                     break
//                 case "buyValue":
//                     checkNPush(i, `${formatMoney(item.value, false)}${(!item.buyable) ? " (not buyable)" : ""}`)
//                     break
//                 case "sellValue":
//                     if (!item.sellable || !item.sellValue) {
//                         checkNPush(i, "Not sellable")
//                         break
//                     }

//                     checkNPush(i, formatMoney(item.sellValue, false))
//                     break
//                 case "description":
//                     checkNPush(i, item.description)
//                     break
//             }
//             i++
//         })

//         returnArray.push(array)
//     })

//     return returnArray.map(row => row.map((value, i) => value?.padEnd(longestOptions[i] + 1)).join("| ")).join("\n")
// }

const formatOptions = <const>["name", "rarity", "buyValue", "sellValue", "description"]
const formatItem = (itemKey: ItemList, options: { [key in typeof formatOptions[number]]?: boolean } = {}) => {
    formatOptions.forEach(key => {
        if (!(key in options)) {
            options[key] = true
        }
    })

    const item = _items[itemKey]
    let formattedString = ""

    if (options.name) {
        formattedString += `${item.icon} **${capital(itemKey)}** `
    }
    if (options.rarity) {
        formattedString += `- \`⭐x${item.rarity + 1}\` `
    }

    if (options.buyValue && options.sellValue) {
        formattedString += `- ${formatMoney(item.value)}${(item.buyable) ? "" : " (not buyable)"}/${item.sellable && item.sellValue ? `${formatMoney(item.sellValue)} (sell)` : "(not sellable)"}`
    } else if (options.sellValue) {
        formattedString += `- ${item.sellable && item.sellValue ? `${formatMoney(item.sellValue)} (sell)` : "(not sellable)"}`
    } else if (options.buyValue) {
        formattedString += `- ${formatMoney(item.value)}${(item.buyable) ? "" : " (not buyable)"}`
    }

    if (options.description) {
        return `${formattedString.trim()}\n${item.description}`
    }

    return formattedString.trim()
}

// console.log(
//     formatItem("gem")
// )

export {
    itemList,
    Rarities,
    ItemType,
    formatItem
}
export type {
    Item,
    ItemList
}


