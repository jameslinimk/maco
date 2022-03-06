import { SlashCommandBuilder } from "../../../../node_modules/@discordjs/builders/dist/index.js"
import type { Command } from "../../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("walk")
        .setDescription("Go for a walk to get money and encounter events!"),
    cooldown: 5000,
    execute: async (interaction) => {
        await interaction.reply("Walk")
    }
}