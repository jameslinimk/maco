import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from "discord.js"
import type { CommandInteraction } from "discord.js"

export default async (pages: (string | string[])[], interaction: CommandInteraction, baseEmbed?: MessageEmbed, edit = false) => {
    return new Promise<void>((resolve) => {
        const buttons = [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId("setPage")
                        .setPlaceholder("Select a page")
                        .addOptions(
                            pages.map((_, i) => {
                                return {
                                    label: `Page ${i + 1}`,
                                    description: `Go to page ${i + 1}`,
                                    value: `page${i}`
                                }
                            })
                        )
                ),
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("home")
                        .setEmoji("⏪")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("back")
                        .setEmoji("◀")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId("forward")
                        .setEmoji("▶")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId("end")
                        .setEmoji("⏩")
                        .setStyle("SUCCESS")
                )
        ]

        const getEmbed = () => {
            const content = pages[selectedPage]

            if (baseEmbed) {
                return baseEmbed
                    .setDescription(
                        (typeof content === "string")
                            ? content
                            : content.join("\n")
                    )
                    .setTitle(`Page ${selectedPage + 1}/${pages.length}`)
            }

            return new MessageEmbed()
                .setDescription(
                    (typeof content === "string")
                        ? content
                        : content.join("\n")
                )
                .setColor("PURPLE")
                .setTitle(`Page ${selectedPage + 1}/${pages.length}`)
        }

        let selectedPage = 0
        if (edit) {
            interaction.editReply({
                embeds: [getEmbed()],
                components: buttons
            })
        } else {
            interaction.reply({
                embeds: [getEmbed()],
                components: buttons
            })
        }

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 15000
        })

        collector.on("collect", async i => {
            switch (i.customId) {
                case "home":
                    selectedPage = 0
                    break
                case "end":
                    selectedPage = pages.length - 1
                    break
                case "back":
                    selectedPage -= 1
                    if (selectedPage < 0) selectedPage = pages.length - 1
                    break
                case "forward":
                    selectedPage += 1
                    if (selectedPage > pages.length - 1) selectedPage = 0
                    break
                default:
                    if (!i.isSelectMenu()) break
                    selectedPage = parseInt(i.values[0].substring(4))
                    break
            }

            i.update({
                embeds: [getEmbed()],
                components: buttons
            })
        })

        collector.on("end", () => {
            const newRow: MessageActionRow[] = []
            buttons.forEach(row => {
                newRow.push(new MessageActionRow()
                    .addComponents(
                        row.components.map(cell => {
                            cell.disabled = true
                            return cell
                        })
                    ))
            })
            interaction.editReply({
                embeds: [getEmbed()],
                content: "`⛔` | Message timed out!",
                components: newRow
            })
            resolve()
        })
    })
}