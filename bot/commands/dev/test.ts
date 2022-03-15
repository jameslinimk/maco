import { SlashCommandBuilder } from "@discordjs/builders"
import pages from "../../ts/pages.js"
import type { Command } from "../command.js"

export default <Command>{
    dataBuilder: new SlashCommandBuilder()
        .setName("test")
        .setDescription("A dev-locked testing command!")
        .setDefaultPermission(false),
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
        pages(["pog", "man"], interaction)
    }
}