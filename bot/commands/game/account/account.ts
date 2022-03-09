import type { Command } from "../../command.js"
import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
import { User } from "../../../ts/user.js"
import type { SingularMoneyHistory } from "../../../ts/user.js"
import { MessageEmbed } from "discord.js"
import type { GuildMember } from "discord.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import { defaultMomentFormat, formatMoney } from "../../../ts/globalFunctions.js"

const parseHistory = (history: SingularMoneyHistory) => `\`${defaultMomentFormat(new Date(history.time))}\` | ${formatMoney(history.money)} | \`${history.reason}\``

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("account")
        .setDescription("Various commands to create and get info about your account!")
        .addSubcommand(command => command
            .setName("create")
            .setDescription("Create a new account!")
        )
        .addSubcommand(command => command
            .setName("history")
            .setDescription("Get your previous transaction and wealth gain history!")
        ),
    execute: async (interaction) => {
        switch (interaction.options.getSubcommand()) {
            case "create": {
                if (User.load(interaction.user.id)) return interaction.reply("`⛔` | You already have an account!")
                const user = new User(interaction.user.id)
                user.save()
                await interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Created a new account!")
                            .setColor("BLURPLE")
                            .setDescription(`Don't know what to do? Here are some fun commands to get you started:

\`/items\` - Get a list of all the items in the game`)
                    ]
                })
                break
            }
            case "history": {
                const user = User.load(interaction.user.id)
                if (!user) return interaction.reply("`⛔` | You don't have an account! Create one using `/account create`!")
                const history = user.moneyHistory

                const pageItems = splitIntoChunks(history.map(history => `${parseHistory(history)}\n`), 7)
                pages(pageItems, interaction, new MessageEmbed()
                    .setColor("BLURPLE")
                    .setAuthor({ name: `${(<GuildMember>interaction.member).displayName}'s money history`, iconURL: (<GuildMember>interaction.member).displayAvatarURL() })
                )
                break
            }
            default: {
                await interaction.reply("`⛔` | That command doesn't exist!")
                break
            }
        }
    }
}