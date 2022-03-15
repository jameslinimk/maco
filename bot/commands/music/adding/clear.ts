import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (!queue || !queue.playing) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })
    if (!queue.tracks[0]) return interaction.reply({ content: "`⛔` | There is no other music in the queue!", ephemeral: true })

    queue.clear()
    return interaction.reply("`🗑` | Cleared the queue!")
}