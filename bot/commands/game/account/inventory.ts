import { SlashCommandBuilder } from "@discordjs/builders"
import type { GuildMember } from "discord.js"
import { MessageEmbed } from "discord.js"
import { capital, formatMoney } from "../../../ts/globalFunctions.js"
import type { Item } from "../../../ts/items.js"
import items from "../../../ts/items.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import { User } from "../../../ts/user.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("Get your inventory!"),
    execute: async (interaction) => {
        const user = User.load(interaction.user.id)
        if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Create one using `/account create`!", ephemeral: true })

        const inventoryItems = splitIntoChunks<string>(
            Object.keys(user.inventory).filter(key => user.inventory[key] !== 0).map(key => {
                const item: Item = items[key]
                return `${item.icon} **${capital(key)}** x${user.inventory[key]} - ${item.sellable && item.sellValue ? `${formatMoney(item.sellValue)} (Total: ${formatMoney(item.sellValue * user.inventory[key])})` : " (not sellable)"}\n`
            })
            , 7)

        if (inventoryItems.length < 1) return interaction.reply({ content: "`🎒` | You don't have anything in your inventory! Buys some stuff using `/buy`!", ephemeral: true })

        pages(inventoryItems, interaction, new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor({ iconURL: (<GuildMember>interaction.member).displayAvatarURL(), name: `${(<GuildMember>interaction.member).displayName}'s inventory` })
            .setFooter({ text: "Run \"/info <name>\" to get more info about an item!" })
        )
    }
}