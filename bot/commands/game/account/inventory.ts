import type { GuildMember } from "discord.js"
import { MessageEmbed } from "discord.js"
import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
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
        if (!user) return interaction.reply("`⛔` | You don't have an account! Create one using `/account create`!")

        const inventoryItems = splitIntoChunks<string>(
            Object.keys(user.inventory).filter(key => user.inventory[key] !== 0).reduce<string[]>((res, cur) => {
                const item: Item = items[cur]
                res.push(`${item.icon} **${capital(cur)}** - ${item.sellable && item.sellValue ? `${formatMoney(item.sellValue)} (Total: ${formatMoney(item.sellValue * user.inventory[cur])})` : " (not sellable)"}\n`)
                return res
            }, [])
            , 7)

        if (inventoryItems.length < 1) return interaction.reply("`🎒` | You don't have anything in your inventory! Buys some stuff using `/buy`!")

        pages(inventoryItems, interaction, new MessageEmbed()
            .setColor("BLURPLE")
            .setAuthor({ iconURL: (<GuildMember>interaction.member).displayAvatarURL(), name: `${(<GuildMember>interaction.member).displayName}'s inventory` })
            .setFooter({ text: "Run \"/info <name>\" to get more info about an item!" })
        )
    }
}