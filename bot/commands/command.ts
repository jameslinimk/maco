import type { SlashCommandBuilder } from "@discordjs/builders"
import type { ApplicationCommandPermissions, CommandInteraction } from "discord.js"

interface Command {
    dataBuilder: SlashCommandBuilder
    execute: (interaction: CommandInteraction) => any
    permissions?: ApplicationCommandPermissions[]
}

export type {
    Command
}
