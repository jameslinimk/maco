import { REST } from "@discordjs/rest"
import chalk from "chalk"
import { Routes } from "discord-api-types/v9"
import type { Player } from "discord-player"
import { Client, Intents } from "discord.js"
import type { Command } from "./bot/commands/command.js"
import { musicSetup } from "./bot/ts/music.js"
import { walkCommands, walkEvents } from "./bot/walk.js"
import config from "./config.js"

/* ------------------------------ Client setup ------------------------------ */
interface NewClient extends Client<boolean> { commands: Map<string, Command>, player: Player }
const client = <NewClient>new Client({
    intents: [
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})
client.commands = new Map()
const musicStart = performance.now()
console.log(chalk.red("Started music setup"))
musicSetup(client)
console.log(`${chalk.red("Successfully set up music")} (${performance.now() - musicStart}ms)\n`)

const walkStart = performance.now()
console.log(chalk.red("Started walking through commands and events"))
await Promise.all([walkCommands(client, "./bot/commands"), walkEvents(client, "./bot/events")])
console.log(`${chalk.red("Successfully walked through commands and events")} (${performance.now() - walkStart}ms)\n`)

/* ------------------------------- For testing ------------------------------ */
const rest = new REST({ version: "9" }).setToken(config.token)
try {
    const refreshStart = performance.now()
    console.log(chalk.red("Started refreshing application (/) commands"))

    await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.testGuildId),
        { body: [...client.commands.values()].map(command => command.dataBuilder.toJSON()) },
    )

    console.log(`${chalk.red("Successfully reloaded application (/) commands")} (${performance.now() - refreshStart}ms)\n`)
} catch (error) {
    console.error(error)
}

client.login(config.token)

export type {
    NewClient
}

