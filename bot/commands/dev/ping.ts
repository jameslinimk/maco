import type { Command } from "../command.js"
import { SlashCommandBuilder } from "../../../node_modules/@discordjs/builders/dist/index.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responds with bot & API latency!"),
    execute: async (interaction) => {
        await interaction.reply("`🏓` | Getting ping...")
        await interaction.editReply(`\`🏓\` | Latency is **${Date.now() - interaction.createdTimestamp}ms**. (API Latency is **${Math.round(interaction.client.ws.ping)}ms**)`)
    }
}