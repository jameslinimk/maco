import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import type { ItemList } from "../../../ts/items.js"
import items, { formatItem, Item } from "../../../ts/items.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Get a list of all buyable items"),
    execute: async (interaction) => {
        const listItems = splitIntoChunks(
            Object.keys(items).filter(key => (<Item>items[key]).buyable).reduce<string[]>((res, cur) => {
                res.push(`${formatItem(<ItemList>cur)}\n`)
                return res
            }, [])
            , 7)

        pages(listItems, interaction, new MessageEmbed()
            .setColor("BLURPLE")
            .setFooter({ text: "Run \"/buy <name>\" to purchase an item!" })
        )
    }
}