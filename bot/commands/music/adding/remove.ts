import { Track } from "discord-player"
import { CommandInteraction, MessageEmbed } from "discord.js"
import type { NewClient } from "../../../.."
import { formatNumber } from "../../../ts/globalFunctions.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"

export default async (interaction: CommandInteraction) => {
    if (!interaction.member!.voice.channelId || !interaction.member!.voice.channel) return interaction.reply({ content: "`⛔️` | You are not in a voice channel!", ephemeral: true })
    if (interaction.guild!.me!.voice.channelId && interaction.member!.voice.channelId !== interaction.guild!.me!.voice.channelId) return interaction.reply({ content: "`⛔️` | You are not in my voice channel!", ephemeral: true })

    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (!queue) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })
    if (!queue.tracks[0]) return interaction.reply({ content: "`⛔` | The queue after the current song is empty, use `/music playing` to get info about the current song!", ephemeral: true })

    let longestTrackTitle = 0
    const tracks = queue.tracks.map((track, i) => {
        const trackTitle = `\`${i + 1}.\` **${track.title}** by ${track.author} (${track.duration}) | 👀 ${formatNumber(track.views)}\n`
        if (trackTitle.length > longestTrackTitle) longestTrackTitle = trackTitle.length
        return trackTitle
    })

    pages(splitIntoChunks(tracks, Math.floor(4096 / longestTrackTitle) / 4), interaction, new MessageEmbed()
        .setColor("BLURPLE")
        .setFooter({ text: "Please type in chat the number of the song you want to remove! (15s)" })
        , true)

    const collector = interaction.channel?.createMessageCollector({
        filter: async i => i.author.id === interaction.user.id,
        time: 15000
    })

    if (!collector) return interaction.reply("`⛔` | Something wrong happened... please try again!")

    collector.on("collect", async msg => {
        if (isNaN(<any>msg.content)) {
            await interaction.followUp({ content: `\`⛔\` | **${msg.content}** is not a valid number!`, ephemeral: true })
            return
        }
        const track: Track = queue.tracks[parseInt(msg.content) - 1]
        if (!track) {
            await interaction.followUp({ content: `\`⛔\` | **${msg.content}** is not a valid choice!`, ephemeral: true })
            return
        }

        queue.remove(parseInt(msg.content) - 1)

        await interaction.followUp(`\`⏱️\` | Removed **${track.title}**...`)
        collector.stop("success")
        return
    })

    collector.on("end", async (_, reason) => {
        if (reason === "success") return
        await interaction.followUp({ content: "`⛔` | Took too long.... please try again!", ephemeral: true })
    })
}