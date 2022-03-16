import type { CommandInteraction } from "discord.js"
import { MessageEmbed } from "discord.js"
import type { NewClient } from "../../../.."
import pages, { splitIntoChunks } from "../../../ts/pages.js"

export default (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
	const nowPlaying = queue?.nowPlaying()

	if (!nowPlaying) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })
	if (!queue!.tracks[0]) return interaction.reply({ content: "`⛔` | The queue after the current song is empty, use `/music playing` to get info about the current song!", ephemeral: true })

	let longestTrackTitle = 0
	const tracks = queue!.tracks.map((track, i) => {
		const trackTitle = `\`${i + 1}.\` **${track.title}** by ${track.author} (${track.duration}) | Req by: ${track.requestedBy}\n`
		if (trackTitle.length > longestTrackTitle) longestTrackTitle = trackTitle.length
		return trackTitle
	})

	pages(splitIntoChunks(tracks, Math.floor(4096 / longestTrackTitle) / 4), interaction, new MessageEmbed()
		.setColor("BLURPLE")
		.setTitle(`Music queue for ${interaction.guild!.name}`)
		.setFooter({ text: "Use /music to see commands to add or skip music!" })
		.addField("🎶 Now playing:", `**${nowPlaying.title}** by ${nowPlaying.author} | Req by: ${nowPlaying.requestedBy}
${queue!.createProgressBar()}`)
	)
}