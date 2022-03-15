import chalk from "chalk"
import type { PlayerOptions, Queue, Track } from "discord-player"
import { Player } from "discord-player"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { NewClient } from "../.."

const trackEmbed = (track: Track, baseEmbed: MessageEmbed) => {
    baseEmbed
        .setThumbnail(track.thumbnail)
        .setTitle(`${track.title} by ${track.author}`)
        .setURL(track.url)
        .setDescription(`Length: **${track.duration}s**
Requested by: ${track.requestedBy}`)

    return baseEmbed
}

const defaultOptions: PlayerOptions = {
    leaveOnEmptyCooldown: 5000
}

const musicSetup = (client: NewClient) => {
    client.player = new Player(client)

    client.player.on("channelEmpty", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send(`\`⛔\` | Will leave in ${defaultOptions.leaveOnEmptyCooldown! / 1000}s because there was nobody is in my voice channel!`)
    })

    client.player.on("queueEnd", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("`⛔` | Left because the queue has ended!")
    })

    const handleError = (queue: Queue, error: Error) => {
        console.log(`[${chalk.red("!Error!")}]`)
        console.error(error)
        console.log(`[${chalk.red("-End of error-")}]`)

        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("`⛔` | Something unexpectedly wrong happened... please try again! (the error has been reported to the developer)")
    }

    client.player.on("connectionError", handleError)
    client.player.on("error", handleError)

    client.player.on("trackStart", (queue, track) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send({
            embeds: [trackEmbed(track,
                new MessageEmbed()
                    .setAuthor({ name: "🎶 Now playing..." })
                    .setColor("BLURPLE")
            )]
        })
    })

    /* ------------------------------ Unused events ----------------------------- */
    // client.player.on("botDisconnect", () => {
    //     console.log(` - botDisconnect`)
    // })

    // client.player.on("connectionCreate", () => {
    //     console.log(` - connectionCreate`)
    // })

    // client.player.on("debug", (_, message) => {
    //     console.log(` - ${chalk.blue("Debug:")} ${message}`)
    // })

    // client.player.on("trackAdd", (queue) => {
    //     const interaction = <CommandInteraction>queue.metadata
    //     if (!interaction?.channel) return

    //     interaction.channel.send("trackAdd")
    // })

    // client.player.on("trackEnd", (queue) => {
    //     const interaction = <CommandInteraction>queue.metadata
    //     if (!interaction?.channel) return

    //     interaction.channel.send("trackEnd")
    // })

    // client.player.on("tracksAdd", (queue) => {
    //     const interaction = <CommandInteraction>queue.metadata
    //     if (!interaction?.channel) return

    //     interaction.channel.send("tracksAdd")
    // })
}

export {
    musicSetup,
    trackEmbed,
    defaultOptions
}

