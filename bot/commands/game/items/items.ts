import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { capital, formatMoney } from "../../../ts/globalFunctions.js"
import type { Item } from "../../../ts/items.js"
import items from "../../../ts/items.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("items")
        .setDescription("Get a list of all items"),
    execute: async (interaction) => {
        const listItems = splitIntoChunks(
            Object.keys(items).reduce((res, cur) => {
                const item: Item = items[cur]
                res.push(`${item.icon} **${capital(cur)}** - \`⭐x${item.rarity + 1}\` - ${(item.buyable) ? "" : "(not buyable) "}${formatMoney(item.value)}${item.sellable && item.sellValue ? `/${formatMoney(item.sellValue)} (sell price)` : " (not sellable)"}
${item.description}\n`)
                return res
            }, <string[]>[])
            , 7)

        pages(listItems, interaction, new MessageEmbed()
            .setColor("BLURPLE")
            .setFooter({ text: "Run \"/buy <name>\" to purchase an item!" })
        )
    }
}