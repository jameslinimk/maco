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
    value: number
    sellable: boolean
    sellValue?: number
    type: ItemType
    rarity: Rarities
    description: string
}

type ItemList = "gem" | "diamond"
export default <{ [key in ItemList]: Item }>{
    gem: {
        icon: "💎",
        value: 1,
        sellable: true,
        sellValue: 1,
        type: ItemType.collectable,
        rarity: Rarities.common,
        description: "A gem collected from the deep mines. Been the most stable currency since 103BC"
    },
    diamond: {
        icon: "💍",
        value: 100,
        sellable: true,
        sellValue: 200,
        type: ItemType.collectable,
        rarity: Rarities.godly,
        description: "A diamond found in the deepest mines. Worth 10x gems"
    }
}

export type {
    ItemType,
    Rarities,
    Item,
    ItemList
}