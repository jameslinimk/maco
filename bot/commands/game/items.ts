import type { Item } from "../../ts/items.js"
import type { Command } from "../command.js"
import { SlashCommandBuilder } from "../../../node_modules/@discordjs/builders/dist/index.js"
import pages from "../../ts/pages.js"
import items from "../../ts/items.js"
import { MessageEmbed } from "discord.js"
import { capital, formatMoney } from "../../ts/globalFunctions.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Get a list of all items"),
    execute: async (interaction) => {
        const listItems = Object.keys(items).reduce((res, itemKey, i) => {
            const item: Item = items[itemKey]

            const chunkIndex = Math.floor(i / 7)
            if (!res[chunkIndex]) res[chunkIndex] = []

            res[chunkIndex].push(
                `${item.icon} **${capital(itemKey)}** - \`⭐x${item.rarity + 1}\` - [${formatMoney(item.value)}](http://example.com/)${item.sellable ? `/[${formatMoney(item.sellValue)}](http://example.com/) (sell price)` : " (not sellable)"}
${item.description}\n`
            )

            return res
        }, [])

        pages(listItems, interaction, new MessageEmbed()
            .setColor("BLURPLE")
            .setFooter({ text: "Run \"/buy <name>\" to purchase an item!" })
        )
    }
}