import chalk from "chalk"
import db from "quick.db"

if (process.argv.slice(2).join(" ").length !== 0) {
    console.log(chalk.green(process.argv.slice(2).join(" ")))
    console.log(eval(process.argv.slice(2).join(" ")), "\n")
}

const tableUsers = {}
const users = db.get("users")
if (!users) {
    console.log(chalk.red("No users"))
} else {
    Object.keys(users).forEach(key => tableUsers[key] = JSON.parse(users[key]))
    console.table(tableUsers)
}
