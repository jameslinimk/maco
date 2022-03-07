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

const itemList = <const>["gem", "test"]
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
        value: 1,
        sellable: true,
        sellValue: 1,
        type: ItemType.collectable,
        rarity: Rarities.godly,
        description: "A testing item"
    },
}

export {
    itemList
}

export type {
    ItemType,
    Rarities,
    Item,
    ItemList
}