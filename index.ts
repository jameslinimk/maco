import { REST } from "@discordjs/rest"
import chalk from "chalk"
import { Routes } from "discord-api-types/v9"
import type { Queue } from "discord-player"
import { Player } from "discord-player"
import { Client, CommandInteraction, Intents } from "discord.js"
import type { Command } from "./bot/commands/command.js"
import { walkCommands, walkEvents } from "./bot/walk.js"
import config from "./config.js"

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

/* -------------------------------- For music ------------------------------- */
// Create a new Player (you don't need any API Key)
const player = new Player(client)

// add the trackStart event so when a song will be played this message will be sent
player.on("trackStart", (queue: Queue<CommandInteraction<CacheType>>, track) => {
    queue.metadata
    queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`)
})

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
