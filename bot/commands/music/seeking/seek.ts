import type { CommandInteraction } from "discord.js"
import ms from "ms"
import type { NewClient } from "../../../.."

export default async (interaction: CommandInteraction) => {
	const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

	if (!queue?.nowPlaying()) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

	const rawTime = interaction.options.getString("time")
	if (!rawTime) return interaction.reply({ content: "`⛔` | You didn't supply a time!", ephemeral: true })

	const timeMs = ms(rawTime)
	if (!timeMs) return interaction.reply({ content: `\`⛔\` | **${rawTime}** is not a valid time!`, ephemeral: true })
	if (timeMs < 0) return interaction.reply({ content: `\`⛔\` | **${rawTime}** can't be a negative time!`, ephemeral: true })

	if (await queue.seek(Math.min(timeMs, queue.nowPlaying().durationMS))) return interaction.reply(`\`⌚\` | Seeked the current song to **${ms(timeMs, { long: true })}**!`)
	return interaction.reply({ content: "`⛔` | Something went wrong.. please try again!", ephemeral: true })
}