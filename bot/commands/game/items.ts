import { Command } from "../command.js"
import { SlashCommandBuilder } from "@discordjs/builders"
import pages from "../../ts/pages.js"
import items from "../../ts/items.js"
import type { Item } from "../../ts/items.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Get a list of all items"),
    execute: async (interaction) => {
        const listItems = Object.keys(items).reduce((res, itemKey, i) => {
            const item: Item = items[itemKey]
            const chunkIndex = Math.floor(i / 7)

            if (!res[chunkIndex]) {
                res[chunkIndex] = {
                    description: `Items page ${i + 1}`,
                    content: []
                }
            }

            res[chunkIndex].content.push(
                `\`${itemKey}\` | ${item.displayName} \`${"⭐".repeat(item.rarity + 1)}\`${item.sellable ? ` | **$${item.value}**/**$${item.sellValue}**` : ""}`
            )

            return res
        }, [])
        console.log(listItems)
        pages(listItems, interaction)
    }
}