import type { Command } from "../../command.js"
import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
import { User } from "../../../ts/user.js"
import { GuildMember, MessageEmbed } from "discord.js"
import pages from "../../../ts/pages.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("account")
        .setDescription("Various commands to create and get info about your account!")
        .addSubcommand(command => command
            .setName("create")
            .setDescription("Create a new account!")
        )
        .addSubcommand(command => command
            .setName("info")
            .setDescription("Get detailed information about your account!")
        ),
    execute: async (interaction) => {
        switch (interaction.options.getSubcommand()) {
            case "create": {
                if (User.load(interaction.user.id)) return interaction.reply({ content: "`⛔` | You already have an account!" })
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
            case "info": {
                const user = User.load(interaction.user.id)
                if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Create one using `/account create`!" })

                const history = user.moneyHistory

                const pageItems = history.reduce((res, history, i) => {
                    const chunkIndex = Math.floor(i / 7)
                    if (!res[chunkIndex]) res[chunkIndex] = []

                    res[chunkIndex].push(
                        `${history}\n`
                    )

                    return res
                }, [])

                pages(pageItems, interaction, new MessageEmbed()
                    .setColor("BLURPLE")
                    .setAuthor({ name: `${(<GuildMember>interaction.member).displayName}'s money history`, iconURL: (<GuildMember>interaction.member).displayAvatarURL() })
                )
                break
            }
            default: {
                await interaction.reply({ content: "`⛔` | That command doesn't exist!" })
                break
            }
        }
    }
}