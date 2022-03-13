import { SlashCommandBuilder } from "@discordjs/builders"
import type { Command } from "../command.js"
import play from "./adding/play.js"
import search from "./adding/search.js"
import loop from "./effects/loop.js"
import playing from "./info/playing.js"
import queue from "./info/queue.js"
import skip from "./seeking/skip.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Various commands to play and control music!")
        .addSubcommand(command => command
            .setName("play")
            .setDescription("Instantly join and play the first result of the query!")
            .addStringOption(option => option
                .setName("query")
                .setDescription("Song name/url/playlist to search up!")
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
        )
        .addSubcommand(command => command
            .setName("queue")
            .setDescription("Get the current queue!")
        )
        .addSubcommand(command => command
            .setName("skip")
            .setDescription("Play the next song in queue!")
        )
        .addSubcommand(command => command
            .setName("playing")
            .setDescription("Get info about the currently playing song!")
        )
        .addSubcommand(command => command
            .setName("loop")
            .setDescription("Loop either the current song or queue!")
            .addBooleanOption(option => option
                .setName("queue")
                .setDescription("If true, will loop the queue instead of the song")
                .setRequired(false)
            )
        )
        .addSubcommand(command => command
            .setName("volume")
            .setDescription("Adjust the volume of the current music!")
            .addIntegerOption(option => option
                .setName("volume")
                .setDescription("Volume to set the music (0-100)")
                .setMaxValue(100)
                .setMinValue(0)
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
            case "queue":
                await queue(interaction)
                break
            case "skip":
                await skip(interaction)
                break
            case "playing":
                await playing(interaction)
                break
            case "loop":
                await loop(interaction)
                break
            case "volume":

                break
            default:
                await interaction.reply({ content: "`⛔` | That command doesn't exist!", ephemeral: true })
                break
        }
    }
}