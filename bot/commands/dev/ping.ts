import { SlashCommandBuilder } from "@discordjs/builders"
import type { Command } from "../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responds with bot & API latency!"),
    execute: async (interaction) => {
        // FIXME `Date.now() - interaction.createdTimestamp` is returning a negative value
        await interaction.reply(`\`🏓\` | Latency is **${Date.now() - interaction.createdTimestamp}ms**. (API Latency is **${Math.round(interaction.client.ws.ping)}ms**)`)
    }
}