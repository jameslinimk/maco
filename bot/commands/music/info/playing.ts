import { CommandInteraction, MessageEmbed } from "discord.js"
import type { NewClient } from "../../../.."
import { trackEmbed } from "../../../ts/music.js"

export default (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)
    const nowPlaying = queue?.nowPlaying()

    if (!queue || !nowPlaying) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })

    return interaction.reply({
        embeds: [trackEmbed(nowPlaying,
            new MessageEmbed()
                .setAuthor({ name: "🎶 Currently playing..." })
                .setColor("BLURPLE")
                .addField("Progress", queue.createProgressBar())
        )]
    })
}