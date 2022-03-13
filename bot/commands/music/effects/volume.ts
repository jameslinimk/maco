import type { CommandInteraction } from "discord.js"

export default (interaction: CommandInteraction) => {
    const volume = interaction.options.getInteger("volume")
    if (!volume)
}