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
    displayName: string
    value: number
    sellable: boolean
    sellValue?: number
    type: ItemType
    rarity: Rarities
}

type ItemList = "gem"
export default <{ [key in ItemList]: Item }>{
    gem: {
        displayName: "💎 Gem",
        value: 1,
        sellable: true,
        sellValue: 1,
        type: ItemType.collectable,
        rarity: Rarities.common
    },
    diamond: {
        displayName: "💍 Diamond",
        value: 100,
        sellable: true,
        sellValue: 200,
        type: ItemType.collectable,
        rarity: Rarities.godly
    }
}

export type {
    ItemType,
    Rarities,
    Item,
    ItemList
}