import { SlashCommandBuilder } from "@discordjs/builders"
import { GuildMember, MessageEmbed } from "discord.js"
import { User } from "../../../../ts/user.js"
import type { Command } from "../../../command.js"
import { parseEvent, randomEvent } from "./events.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("walk")
        .setDescription("Go for a walk to get money and encounter events!"),
    cooldown: 5000,
    execute: async (interaction) => {
        const user = User.load(interaction.user.id)
        if (!user) return interaction.reply("`⛔` | You don't have an account! Make one using `/account create`!")

        const event = parseEvent(randomEvent(), <GuildMember>interaction.member)
        user.money += event.money
        user.moneyHistory.push({ money: event.money, reason: "/walk", time: Date.now() })
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