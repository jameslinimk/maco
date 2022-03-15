import { SlashCommandBuilder } from "@discordjs/builders"
import { GuildMember, MessageEmbed } from "discord.js"
import { capital, formatMoney } from "../../../ts/globalFunctions.js"
import type { Item, ItemList } from "../../../ts/items.js"
import items, { itemList } from "../../../ts/items.js"
import { User } from "../../../ts/user.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item")
        .addStringOption(option => option
            .addChoices(
                itemList.filter(item => items[item].buyable).map(key => {
                    const item = items[key]
                    return ([`${item.icon} ${capital(key)} ${formatMoney(item.value, false)}`, key])
                })
            )
            .setName("item")
            .setDescription("Select a buyable item to buy")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(99)
            .setName("amount")
            .setDescription("Select an amount of the given item to buy")
        )
        .addBooleanOption(option => option
            .setRequired(false)
            .setName("max")
            .setDescription("Will buy the max amount of items you can afford (overrides amount)")
        ),
    execute: async (interaction) => {
        const user = User.load(interaction.user.id)
        if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Make one using `/account create`!", ephemeral: true })

        const itemKey = <ItemList>interaction.options.getString("item")
        const item: Item = items[itemKey]
        if (!item) return interaction.reply({ content: "`⛔` | That item doesn't exist!", ephemeral: true })
        if (!item.buyable) return interaction.reply({ content: "`⛔` | That item isn't buyable!", ephemeral: true })

        const maxAmount = Math.floor(user.money / item.value)
        const max = interaction.options.getBoolean("max") || false

        const amount = (!max) ? interaction.options.getInteger("amount") || 1 : maxAmount
        const price = (!max)
            ? amount * item.value
            : maxAmount * item.value

        if (user.money < price || user.money < item.value) return interaction.reply({ content: `\`💸\` | You don't have enough money! Missing: ${formatMoney((price - user.money === 0) ? item.value : price - user.money)}`, ephemeral: true })
        user.money -= price
        user.moneyHistory.push({ money: -price, reason: `Bought (x${amount}) ${item.icon} ${capital(itemKey)}`, time: Date.now() })
        user.invAdd(itemKey, amount)

        user.save()

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLURPLE")
                    .setAuthor({ iconURL: (<GuildMember>interaction.member).displayAvatarURL(), name: `${(<GuildMember>interaction.member).displayName}'s receipt` })
                    .setDescription(`${interaction.user} bought ${item.icon} **${capital(itemKey)}** (x${amount}) for ${formatMoney(price)}`)
            ]
        })
    }
}