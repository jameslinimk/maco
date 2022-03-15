import { ApplicationCommandPermissions } from "discord.js"
import { promises as fs } from "fs"
import path from "path"
import type { NewClient } from "../index.js"
import type { Command } from "./commands/command.js"
import type { Event } from "./events/event.js"

/**
 * Walk through folders and sub-folders and set their corresponding command on the client
 */
const walkCommands = async (client: NewClient, directory: string) => {
    for (const file of await fs.readdir(directory)) {
        const absolute = path.join(directory, file)
        const lstat = await fs.stat(absolute)
        if (lstat.isDirectory()) {
            await walkCommands(client, absolute)
            continue
        }
        if (!lstat.isFile() || !file.endsWith(".js")) continue

        const command: Command = (await import(`../${absolute}`)).default
        if (!command?.dataBuilder || !command?.execute || typeof command.execute !== "function") continue
        client.commands.set(command.dataBuilder.name, command)
    }
}

const setCommandPermissions = async (client: NewClient, guildId: string) => {
    const guild = client.guilds.cache.get(guildId)
    if (!guild) return

    (await guild.commands.fetch()).forEach(command => {
        const clientCommand = client.commands.get(command.name)
        if (!clientCommand) return

        client.commands.set(command.name, {
            ...clientCommand,
            id: command.id
        })

        if (!clientCommand.permissions) return

        guild.commands.permissions.add({
            command: command.id,
            permissions: clientCommand.permissions.map(permission => {
                if (permission.id !== "EVERYONE") return permission
                permission.id = guild.roles.everyone.id
                return permission
            })
        })
    })
}

const updatePerms = async (commandName: string, newPermissions: ApplicationCommandPermissions[], client: NewClient, guildId: string) => {
    const guild = client.guilds.cache.get(guildId)
    if (!guild) return

    const id = client.commands.get(commandName)?.id
    if (!id) return

    guild.commands.permissions.add({
        command: id,
        permissions: newPermissions.map(permission => {
            if (permission.id !== "EVERYONE") return permission
            permission.id = guild.roles.everyone.id
            return permission
        })
    })
}

/**
 * Walk through folders and sub-folders and set their corresponding event on the client
 */
const walkEvents = async (client: NewClient, directory: string) => {
    for (const file of await fs.readdir(directory)) {
        const absolute = path.join(directory, file)
        const lstat = await fs.stat(absolute)
        if (lstat.isDirectory()) {
            await walkEvents(client, absolute)
            continue
        }
        if (!lstat.isFile() || !file.endsWith(".js")) continue

        const event: Event = (await import(`../${absolute}`)).default
        if (typeof event !== "function") continue
        event(client)
    }
}

export {
    walkCommands,
    setCommandPermissions,
    walkEvents,
    updatePerms
}

