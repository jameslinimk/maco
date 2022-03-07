import { GuildMember, MessageEmbed } from "discord.js"
import type { Command } from "../../command.js"
import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
import { parseEvent, randomEvent } from "./events.js"
import { User } from "../../../ts/user.js"
import { defaultMomentFormat, formatMoney } from "../../../ts/globalFunctions.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("walk")
        .setDescription("Go for a walk to get money and encounter events!"),
    cooldown: 5000,
    execute: async (interaction) => {
        const user = User.load(interaction.user.id)
        if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Make one using `/account create`!" })

        const event = parseEvent(randomEvent(), <GuildMember>interaction.member)
        user.money += event.money
        user.moneyHistory.push(`\`${defaultMomentFormat()}\` | \`/walk\` | [+${formatMoney(event.money)}](https://example.com/)`)
        user.save()

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("BLURPLE")
                    .setDescription(event.message)
            ]
        })
    }
}