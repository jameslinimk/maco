import { Client, Intents } from "discord.js"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import type { Command } from "./bot/commands/command.js"
import { walkCommands, walkEvents } from "./bot/walk.js"
import config from "./config.js"
import chalk from "chalk"

/* ------------------------------ Client setup ------------------------------ */
interface NewClient extends Client<boolean> { commands: Map<string, Command> }
const client = <NewClient>new Client({
    intents: [
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})
client.commands = new Map()
await walkCommands(client)
await walkEvents(client)

/* ------------------------------- For testing ------------------------------ */
const rest = new REST({ version: "9" }).setToken(config.token)
try {
    console.log(chalk.red("Started refreshing application (/) commands."))

    await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.testGuildId),
        { body: Array.from(client.commands.values()).map(command => command.dataBuilder.toJSON()) },
    )

    console.log(chalk.red("Successfully reloaded application (/) commands.\n"))
} catch (error) {
    console.error(error)
}

client.login(config.token)

export type {
    NewClient
}