import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import path from 'path'
import dotenv from "dotenv"
import mongoose from 'mongoose'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]
})


client.on('ready', async () => {
    try {
        console.log(`Logged in as ${client.user?.tag}!`);

        await mongoose.connect(process.env.mongodb || "", {
            keepAlive: true
        })
        console.log("Connected to MongoDB!")

        new WOKCommands(client, {
            commandsDir: path.join(__dirname, '/commands'),
            featuresDir: path.join(__dirname, '/handler'),
            mongoUri: process.env.mongodb,
            typeScript: true,
            showWarns: false,
            disabledDefaultCommands: [
                "help"
            ],
            testServers: ['725613335940300871']
        });
    } catch (err) {
        console.log(err);
    }
})

process.on('unhandledRejection', err => {
    console.error('Unhandled promise rejection:', err);
});

client.on("warn", (e) => console.warn(e));

client.login(process.env.token);

