import { Command } from "../command.js"
import { SlashCommandBuilder } from "@discordjs/builders"
import pages from "../../ts/pages.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("test")
        .setDescription("A dev-locked testing command!"),
    permissions: [
        {
            id: "EVERYONE",
            type: "ROLE",
            permission: false,
        },
        {
            id: "400029130219061260",
            type: "USER",
            permission: true
        }
    ],
    execute: async (interaction) => {
        await pages([
            {
                title: "Title #1",
                description: "#1 description",
                content: "**What is up?**\nPagman!"
            },
            {
                title: "Title #2",
                description: "#2 description",
                content: "**What is up?**\nNot pagman!"
            }
        ], interaction)
        console.log("ended")
    }
}