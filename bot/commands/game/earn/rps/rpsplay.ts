import { SlashCommandBuilder } from "@discordjs/builders"
import config from "../../../../../config.js"
import type { NewClient } from "../../../../../index.js"
import { updatePerms } from "../../../../walk.js"
import type { Command } from "../../../command.js"
import pendingRps from "./pendingRps.js"

export default <Command>{
	dataBuilder: new SlashCommandBuilder()
		.setName("rpsplay")
		.setDescription("Accept a RPS invite from another user!")
		.addIntegerOption(option => option
			.setName("bet")
			.setDescription("Set a bet to bet on the game. Winner will take all bets")
			.setRequired(false)
		),
	permissions: [
		{
			id: "EVERYONE",
			type: "ROLE",
			permission: false,
		}
	],
	execute: async (interaction) => {
		if (!pendingRps.checkAway(interaction.user.id)) {
			updatePerms("rpsplay", [
				{
					id: interaction.user.id,
					permission: false,
					type: "USER"
				}
			], <NewClient>interaction.client, config.testGuildId)
			return interaction.reply({ content: "`⛔` | You don't have a pending game to accept!", ephemeral: true })
		}

		console.log("pendingRps.ready(interaction.user.id)", pendingRps.ready(interaction.user.id))
		return interaction.reply("Readied!")
	}
}