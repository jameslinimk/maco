import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { capital, formatMoney } from "../../../ts/globalFunctions.js"
import items, { Item, ItemList, itemList, ItemType, Rarities } from "../../../ts/items.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get info about a certain item")
        .addStringOption(option => option
            .addChoices(
                itemList.reduce<([name: string, value: string])[]>((res, cur) => {
                    res.push([`${items[cur].icon} ${capital(cur)}`, cur])
                    return res
                }, [])
            )
            .setName("item")
            .setDescription("Item to see more info about")
            .setRequired(true)
        ),
    execute: async (interaction) => {
        const itemKey = <ItemList>interaction.options.getString("item")
        const item: Item = items[itemKey]
        if (!item) return interaction.reply("`⛔` | That item doesn't exist!")

        const itemEmbed = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${item.icon} ${capital(itemKey)}'s item info`)
            .addFields([
                {
                    name: "Buyable / Sellable", value:
                        ((item.buyable) ? `\`✅\` Yes (${formatMoney(item.value)})` : `\`⛔\` No (${formatMoney(item.value)})`)
                        + " / "
                        + ((item.sellable && item.sellValue) ? `\`✅\` Yes (${formatMoney(item.sellValue)})` : "`⛔` No")
                    , inline: true
                },
                { name: "Rarity", value: `\`⭐x${item.rarity}\` (${capital(Rarities[item.rarity])})`, inline: true },
                { name: "Type", value: `${capital(ItemType[item.type])}`, inline: true },
                { name: "Description", value: `"*${item.description}*"` }
            ])

        await interaction.reply({
            embeds: [itemEmbed]
        })
    }
}