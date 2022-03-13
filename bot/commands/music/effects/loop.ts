import { QueueRepeatMode } from "discord-player"
import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../.."

export default (interaction: CommandInteraction) => {
    if (!interaction.guildId || !interaction.guild) return
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId)
    if (!queue || !queue.playing) return interaction.reply({ content: "`⛔` | There is no music currently playing, play some using `/music`!", ephemeral: true })
    const loopQueue = interaction.options.getBoolean("queue") || false

    if (loopQueue) {
        if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.reply(`\`⛔\` | Already looping the current track! Use \`/music loop\` to un-loop the current track!`)
        return interaction.reply(queue.setRepeatMode(queue.repeatMode === QueueRepeatMode.OFF ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF)
            ? `\`🔁\` | Queue repeat mode ${queue.repeatMode === QueueRepeatMode.OFF ? "disabled" : "enabled. The whole queue will be repeated!"}`
            : "`⛔` | Something went wrong.. please try again!"
        )
    }

    if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.reply(`\`⛔\` | Already looping the current queue! Use \`/music loop queue\` to un-loop the current queue!`)
    return interaction.reply(queue.setRepeatMode(queue.repeatMode === QueueRepeatMode.OFF ? QueueRepeatMode.TRACK : QueueRepeatMode.OFF)
        ? `\`🔁\` | Repeat mode ${queue.repeatMode === QueueRepeatMode.OFF ? "disabled" : "enabled. The current track will be repeated endlessly!"}`
        : "`⛔` | Something went wrong.. please try again!"
    )
}