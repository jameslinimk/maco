import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../../.."

export default async (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
    if (!queue || !queue.playing) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

    return interaction.reply(`\`🎶\` | Enabled filter(s): ${queue.getFiltersEnabled().map(filter => `**${filter}**`).join(", ")}`)
}