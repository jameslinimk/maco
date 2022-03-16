import type { SlashCommandBuilder } from "@discordjs/builders"
import type { ApplicationCommandPermissions, CommandInteraction, PermissionString } from "discord.js"

interface Command {
	dataBuilder: SlashCommandBuilder
	execute: (interaction: CommandInteraction) => unknown
	permissions?: ApplicationCommandPermissions[]
	requiredPermissions?: PermissionString[]
	cooldown?: number
	id?: string
}

export type {
	Command
}

