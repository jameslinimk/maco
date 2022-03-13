import type { Track } from "discord-player"
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

const musicSetup = (client: NewClient) => {
    client.player = new Player(client)

    client.player.on("botDisconnect", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("botDisconnect")
    })

    client.player.on("channelEmpty", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("`⛔` | Left because there was nobody in my voice channel!")
    })

    client.player.on("connectionCreate", (queue, connection) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send(`connectionCreate ${connection}`)
    })

    client.player.on("connectionError", (queue, error) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send(`connectionError ${error}`)
    })

    client.player.on("debug", (queue, message) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send(`debug ${message}`)
    })

    client.player.on("queueEnd", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("queueEnd")
    })

    client.player.on("trackAdd", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("trackAdd")
    })

    client.player.on("trackEnd", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("trackEnd")
    })

    client.player.on("tracksAdd", (queue) => {
        const interaction = <CommandInteraction>queue.metadata
        if (!interaction?.channel) return

        interaction.channel.send("tracksAdd")
    })

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
}

export {
    musicSetup,
    trackEmbed
}

