import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
    if (!queue || !queue.playing) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

    const volume = interaction.options.getInteger("volume")
    if (!volume) return interaction.reply({ content: "`⛔` | You didn't supply a volume!", ephemeral: true })

    if (queue.setVolume(volume)) return interaction.reply(`\`🔊\` | Set the volume to \`${volume}\`!`)
    return interaction.reply({ content: "`⛔` | Something went wrong.. please try again!", ephemeral: true })
}