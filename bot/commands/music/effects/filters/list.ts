import { AudioFilters, QueueFilters } from "discord-player"
import { CommandInteraction, MessageEmbed } from "discord.js"
import pages, { splitIntoChunks } from "../../../../ts/pages.js"

const descriptions = {
    bassboost_low: "The bassboost filter (+15dB)",
    bassboost: "The bassboost filter (+20dB)",
    bassboost_high: "The bassboost filter (+30dB)",
    "8D": "The 8D filter",
    vaporwave: "The vaporwave filter",
    nightcore: "The nightcore filter",
    phaser: "The phaser filter",
    tremolo: "The tremolo filter",
    vibrato: "The vibrato filter",
    reverse: "The reverse filter",
    treble: "The treble filter",
    normalizer: "The normalizer filter (dynamic audio normalizer based)",
    normalizer2: "The normalizer filter (audio compressor based)",
    surrounding: "The surrounding filter",
    pulsator: "The pulsator filter",
    subboost: "The subboost filter",
    karaoke: "The karaoke filter",
    flanger: "The flanger filter",
    gate: "The gate filter",
    haas: "The haas filter",
    mcompand: "The mcompand filter",
    mono: "The mono filter",
    mstlr: "The mstlr filter",
    mstrr: "The mstrr filter",
    compressor: "The compressor filter",
    expander: "The expander filter",
    softlimiter: "The softlimiter filter",
    chorus: "The chorus filter",
    chorus2d: "The chorus2d filter",
    chorus3d: "The chorus3d filter",
    fadein: "The fadein filter",
    dim: "The dim filter",
    earrape: "The earrape filter"
}

const formattedDescriptions = splitIntoChunks(Object.keys(descriptions).map<[key: keyof QueueFilters, description: string]>(key => [<keyof QueueFilters>key, descriptions[key]]), 12).map(page => {
    let longestLength = 0
    page.forEach(filter => { if (filter[0].length > longestLength) longestLength = filter[0].length })
    return page.map(filter => `\`${filter[0].padEnd(longestLength + 1)}\` ${filter[1]} ${AudioFilters.names.slice(0, 25).includes(filter[0]) ? "(list 1)" : "(list 2)"}`)
})

export default (interaction: CommandInteraction) => {
    pages(formattedDescriptions, interaction, new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle("List of all filters")
        .setFooter({ text: "Use \"/music filter list<1/2> <filter>\" to enable a filter. (Filters are split up into 2 lists due to amount)" })
    )
}