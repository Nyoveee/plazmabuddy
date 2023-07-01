require('dotenv').config()

//discordv13 requires intent
const { Client, Intents } = require('discord.js');
const allIntents = new Intents(32767);
const client = new Client(({ intents: allIntents }))

client.on('ready', () => {
    const guildId = ''
    const guild = client.guilds.cache.get(guildId)

    let commands
    if(guild) commands = guild.commands
    if(!guild) commands = client.application.commands

    commands.create({
        name: 'ping',
        description: '(Global) Pings the bot.',
    }).then(() => {
        console.log('Command Successfully created.')
    })
})

client.login(process.env.CLIENT_TOKEN)