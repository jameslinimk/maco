import type { ApplicationCommandPermissions, CommandInteraction } from "discord.js"
import type { SlashCommandBuilder } from "../../node_modules/@discordjs/builders/dist/index.js"

interface Command {
    dataBuilder: SlashCommandBuilder
    execute: (interaction: CommandInteraction) => any
    permissions?: ApplicationCommandPermissions[]
    cooldown?: number
}

export type {
    Command
}
