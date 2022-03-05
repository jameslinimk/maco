import type { Event } from "./event.js"

export default <Event>((client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand() || interaction.user.bot) return

        const command = client.commands.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: "`⛔` | There was an error while executing this command!",
                ephemeral: true
            })
        }
    })
})