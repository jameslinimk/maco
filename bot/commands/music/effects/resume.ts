import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (!queue) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

    if (!queue.connection.paused) return interaction.reply({ content: "`⛔` | The music is already paused!", ephemeral: true })
    if (queue.setPaused(false)) return interaction.reply("`▶` | Resumed!")
    return interaction.reply({ content: "`⛔` | Something went wrong.. please try again!", ephemeral: true })
}