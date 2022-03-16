import chalk from "chalk"
import config from "../../config.js"
import { setCommandPermissions } from "../walk.js"
import type { Event } from "./event.js"

export default <Event>((client) => {
	client.on("ready", () => {
		setCommandPermissions(client, config.testGuildId)

		console.log(`${chalk.blue("Ready!")} | ${chalk.green(`Guilds: ${client.guilds.cache.size}`)} | ${chalk.red(`Users: ${client.users.cache.filter(user => !user.bot).size}`)}`)
		const commands = [ ...client.commands.keys() ]
		console.log(chalk.blue(`${chalk.bold(`Commands (${commands.length}):`)} ${commands.join(", ")}`))
	})
})