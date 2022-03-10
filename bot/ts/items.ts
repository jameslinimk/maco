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
export default <{ [key in ItemList]: Item }>{
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

export {
    itemList,
    Rarities,
    ItemType
}
export type {
    Item,
    ItemList
}

