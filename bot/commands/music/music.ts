import { SlashCommandBuilder } from "@discordjs/builders"
import type { CommandInteraction } from "discord.js"
import type { NewClient } from "../../../index.js"
import type { Command } from "../command.js"
import clear from "./adding/clear.js"
import play from "./adding/play.js"
import remove from "./adding/remove.js"
import search from "./adding/search.js"
import loop from "./effects/loop.js"
import volume from "./effects/volume.js"
import playing from "./info/playing.js"
import queue from "./info/queue.js"
import back from "./seeking/back.js"
import seek from "./seeking/seek.js"
import skip from "./seeking/skip.js"
import stop from "./seeking/stop.js"

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
            .setName("back")
            .setDescription("Play the previous song!")
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
        )
        .addSubcommand(command => command
            .setName("remove")
            .setDescription("Removes a song from the queue")
        )
        .addSubcommand(command => command
            .setName("clear")
            .setDescription("Clear the current queue!")
        )
        .addSubcommand(command => command
            .setName("seek")
            .setDescription("Seek to a certain part of the song!")
            .addStringOption(option => option
                .setName("time")
                .setDescription("The time to seek to (EX: 1s, 2m 15s, 1h etc...)")
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName("stop")
            .setDescription("Stop all currently playing music!")
        ),
    execute: async (interaction) => {
        switch (interaction.options.getSubcommand()) {
            case "play": {
                await play(interaction)
                break
            }
            case "search": {
                await search(interaction)
                break
            }
            case "queue": {
                await queue(interaction)
                break
            }
            case "skip": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await skip(interaction)
                break
            }
            case "back": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await back(interaction)
                break
            }
            case "playing": {
                await playing(interaction)
                break
            }
            case "loop": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await loop(interaction)
                break
            }
            case "volume": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await volume(interaction)
                break
            }
            case "remove": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await remove(interaction)
                break
            }
            case "clear": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await clear(interaction)
                break
            }
            case "seek": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await seek(interaction)
                break
            }
            case "stop": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await stop(interaction)
                break
            }
            default: {
                await interaction.reply({ content: "`⛔` | That command doesn't exist!", ephemeral: true })
                break
            }
        }
    }
}

const basicCheck = (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (interaction.member!.permissions.has("MANAGE_MESSAGES")) return true

    console.log(queue.connection.channel.members.filter(member => member.id !== interaction.client.user!.id && member.id !== interaction.user.id).size)
    if (queue.connection.channel.members.filter(member => member.id !== interaction.client.user!.id && member.id !== interaction.user.id).size === 0) return true

    return interaction.reply({ content: "`⛔` | You either must have the `MANAGE_MESSAGES` permission, or be alone in a voice channel to do that!", ephemeral: true })
}