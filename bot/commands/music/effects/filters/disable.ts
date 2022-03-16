import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../../.."

export default async (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
	if (!queue?.nowPlaying()) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

	await queue.setFilters()
	return interaction.reply("`🎶` | Disabled filters!")
}