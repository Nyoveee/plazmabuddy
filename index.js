require('dotenv').config()
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss) :label' 
});

//discordv13 requires intent
const { Client, Intents, Collection } = require('discord.js');
const allIntents = new Intents(32767);
const client = new Client(({ intents: allIntents }))

//importing modules
const fs = require('fs');
const cron = require('node-cron');
const log = require('./lib/log.js')
const poll = require('./passive/poll.js')
const feed = require('./passive/feed.js');

//--------------------------------------------------------
//LEGACY PREFIX COMMANDS LOGIC
client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

const prefix = '!'

if(!fs.existsSync('./.env')){
    console.error('Missing env file at root of directory. Bot is unable to run.')
    process.exit()
}

cron.schedule('*/5 * * * * *', () => {
    feed.execute(client)
    //supportFeed.execute(client)
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    log.log('Bot is now running.', client)
    //client.channels.cache.get(process.env.logChannelID).send('Bot is now running.')
})

client.on('error', (err) => {
    log.error(`Failed to start bot. Error:\n${err}`)
})

client.on('messageCreate', (message) => {
    try{
        if(message.author.bot){
            return
        }
    
        if(message.channel.id === process.env.pollChannel){
            poll.execute(message)
            return
        }
    
        if(!message.content.startsWith(prefix)){
            return
        }
    
        // .slice(prefix.length) is to disregard the prefix portion of the code.
        // .split takes in a regular expression, where it splits the String when there is a space. It returns an array of arguments.
        const args = message.content.slice(prefix.length).split(/ +/)
        
        //Get the first element of the array, in lowercase. The resulting array's first element is now removed.
        const command = args.shift().toLowerCase()
    
        //List of commands.
        switch(command){
            case 'ping':
                client.commands.get('ping').execute(message, client);
                break
    
            case 'l':
                client.commands.get('verify').execute(message, args, 'l');
                break
    
            case 'link':
                client.commands.get('verify').execute(message, args, 'link');
                break
    
            case 'help':
                client.commands.get('help').execute(message);
                break
    
            case 'general':
                client.commands.get('general').execute(message);
                break
    
            case 'pass':
                client.commands.get('pass').execute(message);
                break
    
            case 'password':
                client.commands.get('pass').execute(message);
                break
    
            case 'invite':
                client.commands.get('invite').execute(message);
                break
    
            default:
                break
    
        }
    }
    catch(error){
        log.error(`Error occured while executing command.\n${error}`)
    }
    
})
//END OF LEGACY PREFIX COMMANDS LOGIC
//--------------------------------------------------------

//--------------------------------------------------------
//SLASH COMMANDS LOGIC
client.sCommands = new Collection()
const sCommandFiles = fs.readdirSync('./sCommands').filter(file => file.endsWith('.js'))

for (const file of sCommandFiles){
    const command = require(`./sCommands/${file}`);
    client.sCommands.set(command.data.name, command)
    //console.log(client.sCommands)
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return

    //command executing
    const command = client.sCommands.get(interaction.commandName);

    if (!command) {
        console.error(`Missing command file based on command name: ${interaction.commandName}.`)
        return
    }

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

//END OF SLASH COMMANDS LOGIC
//--------------------------------------------------------
//Keep it last line.
client.login(process.env.CLIENT_TOKEN)