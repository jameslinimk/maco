import type { Command } from "../command.js"
import type { Item } from "../../ts/items.js"
import { SlashCommandBuilder } from "../../../node_modules/@discordjs/builders/dist/index.js"
import items, { itemList } from "../../ts/items.js"
import { User } from "../../ts/user.js"
import { capital, formatMoney } from "../../ts/globalFunctions.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("buy")
        .setDescription("Buy an item")
        .addStringOption(option => option
            .addChoices(
                itemList.filter(item => items[item].buyable).reduce((res, cur) => {
                    const item = items[cur]
                    res.push([`${item.icon} ${capital(cur)} ($${item.value})`, cur])
                    return res
                }, [])
            )
            .setName("item")
            .setDescription("Select a buyable item to buy")
        )
        .addIntegerOption(option => option
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(99)
            .setName("amount")
            .setDescription("Select an amount of the given item to buy")
        ),
    execute: async (interaction) => {
        const user = User.load(interaction.user.id)
        if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Make one using `/account create`!" })

        const itemKey = interaction.options.getString("item")
        const item: Item = items[itemKey]
        if (!item) return interaction.reply({ content: "`⛔` | That item doesn't exist!" })
        if (!item.buyable) return interaction.reply({ content: "`⛔` | That item isn't buyable!" })
        const amount = interaction.options.getInteger("amount") || 1

        const price = amount * item.value
        if (user.money < price) return interaction.reply({ content: `\`💸\` | You don't have enough money! Missing: [${formatMoney(price - user.money)}](https://example.com/)` })
        user.money -= price
        user.save()

        await interaction.reply({ content: `${item.icon} ${capital(itemKey)} x${amount}` })
    }
}