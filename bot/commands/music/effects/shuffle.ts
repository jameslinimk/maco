import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (!queue || !queue.playing) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })
    if (!queue.tracks[0]) return interaction.reply({ content: "`⛔` | There is no other music in the queue!", ephemeral: true })

    if (queue.tracks.length < 3) return interaction.reply("`⛔` | The queue must have more than 3 songs in it to shuffle!")
    if (queue.shuffle()) return interaction.reply(`\`⏩\` | Shuffled **${queue.tracks.length}** songs!`)
    return interaction.reply("`⛔` | Something went wrong.. please try again!")
}