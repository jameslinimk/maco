import { SlashCommandBuilder } from "@discordjs/builders"
import type { Command } from "../command.js"
import play from "./play.js"
import search from "./search.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Various commands to play and control music!")
        .addSubcommand(command => command
            .setName("play")
            .setDescription("Instantly join and play the first result of the query!")
            .addStringOption(option => option
                .setName("query")
                .setDescription("Song to search up!")
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName("search")
            .setDescription("Search a bunch of songs with a given query!")
            .addStringOption(option => option
                .setName("query")
                .setDescription("Song search to look up!")
                .setRequired(true)
            )
        ),
    execute: async (interaction) => {
        switch (interaction.options.getSubcommand()) {
            case "play":
                await play(interaction)
                break
            case "search":
                await search(interaction)
                break
            default:
                await interaction.reply({ content: "`⛔` | That command doesn't exist!", ephemeral: true })
                break
        }
    }
}