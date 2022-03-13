import type { CommandInteraction } from "discord.js"
import { MessageEmbed } from "discord.js"
import type { NewClient } from "../../.."
import { trackEmbed } from "../../ts/music"

export default async (interaction: CommandInteraction) => {
    if (!interaction.member || !interaction.guild?.me) return
    if (!interaction.member.voice.channelId || !interaction.member.voice.channel) return interaction.reply({ content: "`⛔️` | You are not in a voice channel!", ephemeral: true })
    if (interaction.guild.me.voice.channelId && interaction?.member?.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply({ content: "`⛔️` | You are not in my voice channel!", ephemeral: true })

    const query = interaction.options.getString("query")
    if (!query) return interaction.reply({ content: "`⛔️` | You didn't supply a query!", ephemeral: true })
    const queue = (<NewClient>interaction.client).player.createQueue(interaction.guild, {
        metadata: {
            channel: interaction.channel
        }
    })

    try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
    } catch {
        queue.destroy()
        return interaction.reply({ content: "`⛔️` | Could not join your voice channel!", ephemeral: true })
    }

    await interaction.deferReply()
    const track = await (<NewClient>interaction.client).player.search(query, {
        requestedBy: interaction.user
    }).then(x => x.tracks[0])
    if (!track) return interaction.followUp({ content: `\`⛔️\` | Track **${query}** not found!` })

    queue.play(track)

    return interaction.followUp({
        embeds: [trackEmbed(track,
            new MessageEmbed()
                .setAuthor({ name: "⏱️ Loading track..." })
                .setColor("BLURPLE")
        )]
    })
}