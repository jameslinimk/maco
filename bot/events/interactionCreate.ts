import db from "quick.db"
import type { Event } from "./event.js"

export default <Event>((client) => {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand() || interaction.user.bot) return
        if (interaction.channel?.type === "DM" || !interaction.member) return await interaction.reply("`⛔` | Please execute commands in a server!")

        const command = client.commands.get(interaction.commandName)
        if (!command) return

        if (command.requiredPermissions) {
            for (let i = 0, length = command.requiredPermissions.length; i < length; i++) {
                const permission = command.requiredPermissions[i]
                if (!interaction.member.permissions.has(permission)) return await interaction.reply(`\`⛔\` | To use this command, you must have ${command.requiredPermissions.map(perm => `\`${perm}\``).join(", ")} permissions! Missing: ${command.requiredPermissions.filter(perm => !interaction.member?.permissions.has(perm)).map(perm => `\`${perm}\``).join(", ")}`)
            }
        }

        if (command.cooldown) {
            const lastCommand = db.get(`cooldowns.${command.dataBuilder.name}.${interaction.user.id}`)

            if (lastCommand && Date.now() - lastCommand < command.cooldown) {
                await interaction.reply({ content: `\`⌛\` | Please wait ${((command.cooldown - (Date.now() - lastCommand)) / 1000).toFixed(1)}s more to use this command!`, ephemeral: true })
                return
            }

            db.set(`cooldowns.${command.dataBuilder.name}.${interaction.user.id}`, Date.now())
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: "`⛔` | There was an error while executing this command!", ephemeral: true })
        }
    })
})