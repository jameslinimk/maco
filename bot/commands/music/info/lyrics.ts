import { CommandInteraction, MessageEmbed } from "discord.js"
import lyricsFinder from "lyrics-finder"
import type { NewClient } from "../../../.."
import pages from "../../../ts/pages.js"

export default async (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
    const nowPlaying = queue.nowPlaying()

    if (!queue || !nowPlaying) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

    const lyrics = await lyricsFinder(nowPlaying.title, nowPlaying.author)
    if (!lyrics) return interaction.reply({ content: `\`⛔\` | No lyrics for **${nowPlaying.title}** by ${nowPlaying.author} was found!`, ephemeral: true })

    pages(lyrics.match(/.{1,4096}/g)!, interaction, new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Lyrics for "${nowPlaying.title}"`)
        .setFooter({ text: "Taken from google // Might not be accurate" })
    )
}