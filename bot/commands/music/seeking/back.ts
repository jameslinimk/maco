import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId)

    if (!queue || !queue.playing) return interaction.reply("`⛔` | There is no music currently playing, play some using `/music`!")
    if (!queue.previousTracks[1]) return interaction.reply({ content: "`⛔` | There was no music played before this!", ephemeral: true })

    await queue.back()
    return interaction.reply(`\`⏪\` | Skipped!`)
}