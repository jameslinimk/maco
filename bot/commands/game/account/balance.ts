import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import { formatMoney } from "../../../ts/globalFunctions.js"
import { User } from "../../../ts/user.js"
import type { Command } from "../../command.js"

export default <Command>{
	dataBuilder: new SlashCommandBuilder()
		.setName("balance")
		.setDescription("Get your total amount of money!"),
	execute: async (interaction) => {
		const user = User.load(interaction.user.id)
		if (!user) return interaction.reply({ content: "`⛔` | You don't have an account! Create one using `/account create`!", ephemeral: true })

		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("BLURPLE")
					.setDescription(`Balance: ${formatMoney(user.money)}`)
			]
		})
	}
}