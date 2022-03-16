import type { CommandInteraction } from "discord.js"
import { MessageEmbed } from "discord.js"
import lyricsFinder from "lyrics-finder"
import type { NewClient } from "../../../.."
import pages from "../../../ts/pages.js"

export default async (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
	const nowPlaying = queue?.nowPlaying()

	if (!nowPlaying) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

	await interaction.deferReply()

	const lyrics = await lyricsFinder(nowPlaying.title, nowPlaying.author)
	if (!lyrics) return interaction.editReply(`\`⛔\` | No lyrics for **${nowPlaying.title}** by ${nowPlaying.author} was found!`)

	pages(lyrics.replaceAll("\n", "🎶").match(/.{1,4096}/g)!.map(v => v.replaceAll("🎶", "\n")), interaction, new MessageEmbed()
		.setColor("BLURPLE")
		.setAuthor({ name: `Lyrics for "${nowPlaying.title}"` })
		.setFooter({ text: "Taken from google // Might not be accurate" })
	, true)
}