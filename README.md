# Maco
### Another RPG/currency Discord bot

#### To run:
1. Make sure that the latest [Node](https://nodejs.org/en/download/) and npm versions are installed
2. Make sure `typescript@next` is installed globally (Install using `npm i typescript@next -g`)'
3. Clone and open the git repo
4. Run `npm i` to install the required dependencies
    > (if you get an error while installing `quick.db`, open a terminal with admin permissions and try again)
5. Follow the instructions [here](config.md)
6. Run `tsc` to convert all `.ts` files to `.js` ones
7. Use `node .` to start the application up!

### Some stuff:
 - All js files within the [commands folder](bot/commands) with a default export are seen as a command. The skeleton to a command can be seen [here](bot/commands/command.ts)
 - All js files within the [events folder](bot/events) with a default export are seen as a command. The skeleton to a command can be seen [here](bot/events/event.ts)
