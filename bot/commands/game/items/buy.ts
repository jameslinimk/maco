import type { Command } from "../../command.js"
import type { Item, ItemList } from "../../../ts/items.js"
import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
import items, { itemList } from "../../../ts/items.js"
import { User } from "../../../ts/user.js"
import { capital, formatMoney } from "../../../ts/globalFunctions.js"
import { GuildMember, MessageEmbed } from "discord.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item")
        .addStringOption(option => option
            .addChoices(
                itemList.filter(item => items[item].buyable).reduce((res, cur) => {
                    const item = items[cur]
                    res.push([`${item.icon} ${capital(cur)} ${formatMoney(item.value, false)}`, cur])
                    return res
                }, [])
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
        if (!user) return interaction.reply("`⛔` | You don't have an account! Make one using `/account create`!")

        const itemKey = <ItemList>interaction.options.getString("item")
        const item: Item = items[itemKey]
        if (!item) return interaction.reply("`⛔` | That item doesn't exist!")
        if (!item.buyable) return interaction.reply("`⛔` | That item isn't buyable!")

        const maxAmount = Math.floor(user.money / item.value)
        const max = interaction.options.getBoolean("max") || false

        const amount = (!max) ? interaction.options.getInteger("amount") || 1 : maxAmount
        const price = (!max)
            ? amount * item.value
            : maxAmount * item.value

        if (user.money < price || user.money < item.value) return interaction.reply(`\`💸\` | You don't have enough money! Missing: ${formatMoney((price - user.money === 0) ? item.value : price - user.money)}`)
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