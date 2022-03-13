import { SlashCommandBuilder } from "@discordjs/builders"
import config from "../../../../../config.js"
import type { NewClient } from "../../../../../index.js"
import { User } from "../../../../ts/user.js"
import { updatePerms } from "../../../../walk.js"
import type { Command } from "../../../command.js"
import pendingRps from "./pendingRps.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Play a game of Rock Paper Scissors against another user!")
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to play a game of RPS with ")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("bet")
            .setDescription("Set a bet on the game (if any user doesn't have an account, the bet will be 0)")
            .setRequired(false)
        ),
    execute: async (interaction) => {
        const otherUser = interaction.options.getUser("user")
        if (!otherUser) return interaction.reply({ content: "`⛔` | You didn't include a user to RPS with!", ephemeral: true })

        if (otherUser.id === interaction.user.id) return interaction.reply({ content: "`⛔` | You cant play RPS with yourself (get some friends)!", ephemeral: true })

        const userAccount = User.load(interaction.user.id)
        const otherUserAccount = User.load(otherUser.id)

        const bet = (!otherUserAccount || !userAccount) ? 0 : interaction.options.getInteger("bet") || 0

        updatePerms("rpsplay", [
            {
                id: otherUser.id,
                permission: true,
                type: "USER"
            }
        ], <NewClient>interaction.client, config.testGuildId)

        pendingRps.add(interaction.user.id, otherUser.id)
        await interaction.reply(`OtherUser: ${otherUser} Bet: ${bet}`)

        pendingRps.awaitReady(interaction.user.id, otherUser.id)
    }
}