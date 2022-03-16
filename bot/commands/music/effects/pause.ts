import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

	if (!queue?.nowPlaying()) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

	if (queue.connection.paused) return interaction.reply({ content: "`⛔` | The music is already paused!", ephemeral: true })
	if (queue.setPaused(true)) return interaction.reply("`⏸` | Paused!")
	return interaction.reply({ content: "`⛔` | Something went wrong.. please try again!", ephemeral: true })
}