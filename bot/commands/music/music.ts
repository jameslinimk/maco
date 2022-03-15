import type { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { SlashCommandBuilder } from "@discordjs/builders"
import { AudioFilters } from "discord-player"
import { CommandInteraction, MessageEmbed } from "discord.js"
import type { NewClient } from "../../../index.js"
import type { Command } from "../command.js"
import clear from "./adding/clear.js"
import play from "./adding/play.js"
import remove from "./adding/remove.js"
import search from "./adding/search.js"
import current from "./effects/filters/current.js"
import disable from "./effects/filters/disable.js"
import filter from "./effects/filters/filter.js"
import list from "./effects/filters/list.js"
import loop from "./effects/loop.js"
import pause from "./effects/pause.js"
import resume from "./effects/resume.js"
import shuffle from "./effects/shuffle.js"
import volume from "./effects/volume.js"
import lyrics from "./info/lyrics.js"
import playing from "./info/playing.js"
import queue from "./info/queue.js"
import back from "./seeking/back.js"
import seek from "./seeking/seek.js"
import skip from "./seeking/skip.js"
import stop from "./seeking/stop.js"

const dataBuilder = new SlashCommandBuilder()
    .setName("music")
    .setDescription("Various commands to play and control music!")
    .addSubcommand(command => command
        .setName("help")
        .setDescription("Get a list of all available commands and their options")
    )
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
            .setDescription("Volume to set the music (0-200)")
            .setMaxValue(200)
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
    )
    .addSubcommand(command => command
        .setName("lyrics")
        .setDescription("Get the lyrics of the currently playing music!")
    )
    .addSubcommand(command => command
        .setName("pause")
        .setDescription("Pause the music!")
    )
    .addSubcommand(command => command
        .setName("resume")
        .setDescription("Resume the music!")
    )
    .addSubcommand(command => command
        .setName("shuffle")
        .setDescription("Shuffle the current queue!")
    )
    .addSubcommandGroup(command => command
        .setName("filter")
        .setDescription("Enable or disable filters!")
        .addSubcommand(command => command
            .setName("disable")
            .setDescription("Disable the current filter")
        )
        .addSubcommand(command => command
            .setName("list")
            .setDescription("Get a list of all filters!")
        )
        .addSubcommand(command => command
            .setName("current")
            .setDescription("Get the current active filter!")
        )
        .addSubcommand(command => command
            .setName("list1")
            .setDescription("Select a filter to enable! (First half of filters)")
            .addStringOption(option => option
                .setName("filter")
                .setDescription("Filter to enable")
                .setRequired(true)
                .addChoices(AudioFilters.names.slice(0, 25).map(filter => [filter, filter]))
            )
        )
        .addSubcommand(command => command
            .setName("list2")
            .setDescription("Select a filter to enable! (Second half of filters)")
            .addStringOption(option => option
                .setName("filter")
                .setDescription("Filter to switch to")
                .setRequired(true)
                .addChoices(AudioFilters.names.slice(25).map(filter => [filter, filter]))
            )
        )
    )

const subCommands: SlashCommandSubcommandBuilder[] = dataBuilder["options"]

let longestName = 0
subCommands.forEach(command => { if (command.name.length > longestName) longestName = command.name.length })

const formatCommand = (command: SlashCommandSubcommandBuilder, commandNamePrefix = "") => {
    const options = command.options.filter(option => option.type)
    const required = options.filter(o => o.required)
    const optional = options.filter(o => !o.required)
    return `**\`/music ${commandNamePrefix ? `${commandNamePrefix} ` : ""}${command.name.padEnd(longestName + 1)}\`**: ${command.description}${required && required.length ? ` (+${required.length} options)` : ""}${optional && optional.length ? ` (+${optional.length} optional options)` : ""}`
}

const commandDescriptions = subCommands.reduce<string[]>((res, command) => {
    res.push(formatCommand(command))

    const subCommands = command.options.filter(option => !option.type)
    if (!subCommands || !subCommands.length) return res
    subCommands.forEach(sub => {
        res.push(` - ${formatCommand(<any>sub, command.name)}`)
    })
    return res
}, []).join("\n")

const basicCheck = (interaction: CommandInteraction) => {
    const queue = (<NewClient>interaction.client).player.getQueue(interaction.guildId!)

    if (interaction.member!.permissions.has("MANAGE_MESSAGES")) return true

    console.log(queue.connection.channel.members.filter(member => member.id !== interaction.client.user!.id && member.id !== interaction.user.id).size)
    if (queue.connection.channel.members.filter(member => member.id !== interaction.client.user!.id && member.id !== interaction.user.id).size === 0) return true

    return interaction.reply({ content: "`⛔` | You either must have the `MANAGE_MESSAGES` permission, or be alone in a voice channel to do that!", ephemeral: true })
}

export default <Command>{
    dataBuilder,
    execute: async (interaction) => {
        switch (interaction.options.getSubcommand()) {
            case "help": {
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("BLURPLE")
                            .setTitle("Music commands")
                            .setDescription(commandDescriptions)
                            .setFooter({ text: "Run the command to expand on the arguments!" })
                    ]
                })
                break
            }
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
            case "lyrics": {
                await lyrics(interaction)
                break
            }
            case "pause": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await pause(interaction)
                break
            }
            case "resume": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await resume(interaction)
                break
            }
            case "shuffle": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await shuffle(interaction)
                break
            }
            case "list1": case "list2": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await filter(interaction)
                break
            }
            case "disable": {
                const check = await basicCheck(interaction)
                if (check !== true) return
                await disable(interaction)
                break
            }
            case "list": {
                list(interaction)
                break
            }
            case "current": {
                await current(interaction)
                break
            }
            default: {
                await interaction.reply({ content: "`⛔` | That command doesn't exist!", ephemeral: true })
                break
            }
        }
    }
}