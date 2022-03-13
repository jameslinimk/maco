import { SlashCommandBuilder } from "@discordjs/builders"
import type { ApplicationCommandPermissions, CommandInteraction, PermissionString } from "discord.js"

interface Command {
    dataBuilder: SlashCommandBuilder
    execute: (interaction: CommandInteraction) => any
    permissions?: ApplicationCommandPermissions[]
    requiredPermissions?: PermissionString[]
    cooldown?: number
    id?: string
}

export type {
    Command
}

