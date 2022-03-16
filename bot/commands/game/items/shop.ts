import { SlashCommandBuilder } from "@discordjs/builders"
import { MessageEmbed } from "discord.js"
import type { ItemList } from "../../../ts/items.js"
import items, { formatItem } from "../../../ts/items.js"
import pages, { splitIntoChunks } from "../../../ts/pages.js"
import type { Command } from "../../command.js"

export default <Command>{
	dataBuilder: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("Get a list of all buyable items"),
	execute: (interaction) => {
		pages(
			splitIntoChunks(Object.keys(items).filter(key => items[key]).map(key => `${formatItem(<ItemList>key)}\n`), 7),
			interaction,
			new MessageEmbed()
				.setColor("BLURPLE")
				.setFooter({ text: "Run \"/buy <name>\" to purchase an item!" })
		)
	}
}