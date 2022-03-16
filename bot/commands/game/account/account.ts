import { SlashCommandBuilder } from "@discordjs/builders"
import type { GuildMember } from "discord.js"
import { MessageEmbed } from "discord.js"
import { defaultMomentFormat, formatMoney } from "../../../ts/globalFunctions.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import type { SingularMoneyHistory } from "../../../ts/user.js"
import { User } from "../../../ts/user.js"
import type { Command } from "../../command.js"

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
				if (User.load(interaction.user.id)) return interaction.reply({ content: "`⛔` | You already have an account!", ephemeral: true })
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
				if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Create one using `/account create`!", ephemeral: true })
				const history = user.moneyHistory

				pages(
					splitIntoChunks(history.map(history => `${parseHistory(history)}\n`), 7),
					interaction,
					new MessageEmbed()
						.setColor("BLURPLE")
						.setAuthor({ name: `${(<GuildMember>interaction.member).displayName}'s money history`, iconURL: (<GuildMember>interaction.member).displayAvatarURL() })
				)
				break
			}
			default: {
				await interaction.reply({ content: "`⛔` | That command doesn't exist!", ephemeral: true })
				break
			}
		}
	}
}