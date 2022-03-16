import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."
import { defaultOptions } from "../../../ts/music.js"

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
	const track = await (<NewClient>interaction.client).player.search(query, {
		requestedBy: interaction.user
	})
	if (!track || !track.tracks.length) return interaction.followUp({ content: `\`⛔️\` | No results for **${query}** found!`, ephemeral: true })

	track.playlist ? queue.addTracks(track.tracks) : queue.addTrack(track.tracks[0])
	if (!queue.playing) await queue.play()

	return interaction.followUp(`\`⏱️\` | Queueing ${track.playlist ? track.playlist.type : "track"}${track.playlist ? ` (${track.playlist.tracks.length} songs) (use \`/music queue\` to see the added songs!)` : ` **${track.tracks[0].title}**`}...`)
}