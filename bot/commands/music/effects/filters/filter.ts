import type { QueueFilters } from "discord-player"
import { AudioFilters } from "discord-player"
import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../../.."

export default async (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
	if (!queue?.nowPlaying()) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

	const filter = <keyof QueueFilters | null>interaction.options.getString("filter")
	if (!filter) return interaction.reply({ content: "`⛔` | Missing the filter argument!", ephemeral: true })
	if (!AudioFilters.names.includes(filter)) return interaction.reply({ content: `\`⛔\` | **${filter}** isn't a valid filter!`, ephemeral: true })

	await queue.setFilters({ [filter]: true })
	return interaction.reply(`\`🎶\` | Set filter to **${filter.toLowerCase()}** (might take a bit to apply the filter)`)
}