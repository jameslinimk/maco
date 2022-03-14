import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (!queue || !queue.playing) return interaction.reply("`⛔` | There is no music currently playing, play some using `/music`!")
    if (!queue.tracks[0]) return interaction.reply({ content: "`⛔` | There is no other music in the queue!", ephemeral: true })

    return interaction.reply(queue.skip() ? "`⏩` | Skipped!" : "`⛔` | Something went wrong.. please try again!")
}