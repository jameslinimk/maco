import type { Track } from "discord-player"
import type { CommandInteraction } from "discord.js"
import { MessageEmbed } from "discord.js"
import type { NewClient } from "../../../.."
import { formatNumber } from "../../../ts/globalFunctions.js"
import { defaultOptions } from "../../../ts/music.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"

export default async (interaction: CommandInteraction) => {
    if (!interaction.member!.voice.channelId || !interaction.member!.voice.channel) return interaction.reply({ content: "`⛔️` | You are not in a voice channel!", ephemeral: true })
    if (interaction.guild!.me!.voice.channelId && interaction.member!.voice.channelId !== interaction.guild!.me!.voice.channelId) return interaction.reply({ content: "`⛔️` | You are not in my voice channel!", ephemeral: true })

    const query = interaction.options.getString("query")
    if (!query) return interaction.reply({ content: "`⛔️` | You didn't supply a query!", ephemeral: true })
    const queue = (<NewClient>interaction.client).player.createQueue(interaction.guild!, {
        ...defaultOptions,
        metadata: {
            channel: interaction.channel
        }
    })

    try {
        if (!queue.connection) await queue.connect(interaction.member!.voice.channel)
    } catch {
        queue.destroy()
        return interaction.reply({ content: "`⛔️` | I could not join your voice channel!", ephemeral: true })
    }

    await interaction.deferReply()
    const search = await (<NewClient>interaction.client).player.search(query, {
        requestedBy: interaction.user
    })
    if (!search || !search.tracks.length) return interaction.followUp({ content: `\`⛔️\` | No results for **${query}** found!`, ephemeral: true })

    let longestTrackTitle = 0
    const tracks = search.tracks.map((track, i) => {
        const trackTitle = `\`${i + 1}.\` **${track.title}** by ${track.author} (${track.duration}) | 👀 ${formatNumber(track.views)}\n`
        if (trackTitle.length > longestTrackTitle) longestTrackTitle = trackTitle.length
        return trackTitle
    })

    pages(splitIntoChunks(tracks, Math.floor(4096 / longestTrackTitle) / 4), interaction, new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Search results for "${query}"`)
        .setFooter({ text: "Please type in chat the number of the song you want to play! (15s)" })
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
        const track: Track = search.tracks[parseInt(msg.content) - 1]
        if (!track) {
            await interaction.followUp({ content: `\`⛔\` | **${msg.content}** is not a valid choice!`, ephemeral: true })
            return
        }

        queue.addTrack(track)
        if (!queue.playing) await queue.play()

        await interaction.followUp(`\`⏱️\` | Queueing **${track.title}**...`)
        collector.stop("success")
        return
    })

    collector.on("end", async (_, reason) => {
        if (reason === "success") return
        await interaction.followUp({ content: "`⛔` | Took too long.... please try again!", ephemeral: true })
    })
}