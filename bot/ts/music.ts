import type { Track } from "discord-player"
import { Player } from "discord-player"
import { CommandInteraction, MessageEmbed } from "discord.js"
import { NewClient } from "../.."
import { capital } from "./globalFunctions"

const trackEmbed = (track: Track, baseEmbed: MessageEmbed) => {
    baseEmbed
        .setThumbnail(track.thumbnail)
        .setTitle(`${track.title} by ${track.author}`)
        .setURL(track.url)
        .setDescription(`Length: **${track.duration}s**
Requested by: ${track.requestedBy}`)

    if (track.playlist) baseEmbed.setFooter({ text: `Added ${track.playlist.tracks.length - 1} more songs as a ${capital(track.playlist.type)}` })

    return baseEmbed
}

const musicSetup = (client: NewClient) => {
    client.player = new Player(client)

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
