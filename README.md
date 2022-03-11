# Maco
### Another RPG/currency Discord bot

#### To run:
1. Make sure that the latest [Node](https://nodejs.org/en/download/) and npm versions are installed
2. Clone and open the git repo
3. Run `npm i` to install the required dependencies
    > (if you get an error while installing `quick.db`, open a terminal with admin permissions and try again)
4. Follow the instructions [here](config.md)
5. Run `npm run tsc` to convert all `.ts` files to `.js` ones
6. Use `node .` to start the application up!, or use `npm run dev` to run a auto-reloading application.

### Some stuff:
 - All js files within the [commands folder](bot/commands) with a default export are seen as a command. The skeleton to a command can be seen [here](bot/commands/command.ts)
 - All js files within the [events folder](bot/events) with a default export are seen as a command. The skeleton to a command can be seen [here](bot/events/event.ts)
