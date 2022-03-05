import { promises as fs } from "fs"
import type { NewClient } from "../index.js"
import type { Command } from "./commands/command.js"
import type { Event } from "./events/event.js"

/**
 * Walk through folders and sub-folders and set their corresponding command on the client
 */
const walkCommands = async (client: NewClient, dir = "") => {
    const files = await fs.readdir(`./bot/commands/${dir}`)

    for (const file of files) {
        const lstat = await fs.lstat(`./bot/commands/${dir}/${file}`)
        if (lstat.isDirectory()) {
            await walkCommands(client, file)
            continue
        }
        if (!lstat.isFile() || !file.endsWith(".js")) continue

        const command: Command = (await import(`../bot/commands/${dir}/${file}`)).default
        if (!command?.dataBuilder || !command?.execute) continue
        client.commands.set(command.dataBuilder.name, command)
    }
}

const setCommandPermissions = async (client: NewClient, guildId?: string) => {
    const guild = client.guilds.cache.get(guildId)
    if (!guild) return

    (await guild.commands.fetch()).forEach(command => {
        const permissions = client.commands.get(command.name).permissions
        if (!permissions) return

        guild.commands.permissions.add({
            command: command.id,
            permissions: permissions.map(permission => {
                if (permission.id !== "EVERYONE") return permission
                permission.id = guild.roles.everyone.id
                return permission
            })
        })
    })
}

/**
 * Walk through folders and sub-folders and set their corresponding event on the client
 */
const walkEvents = async (client: NewClient, dir = "") => {
    const files = await fs.readdir(`./bot/events/${dir}`)

    for (const file of files) {
        const lstat = await fs.lstat(`./bot/events/${dir}/${file}`)
        if (lstat.isDirectory()) {
            await walkEvents(client, file)
            continue
        }
        if (!lstat.isFile() || !file.endsWith(".js")) continue

        const event: Event = (await import(`../bot/events/${dir}/${file}`)).default
        if (typeof event !== "function") continue
        event(client)
    }
}

export {
    walkCommands,
    setCommandPermissions,
    walkEvents
}