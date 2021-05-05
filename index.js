require('dotenv').config()
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss) :label' 
});

const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs');
client.commands = new Discord.Collection()
const cron = require('node-cron');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const poll = require('./passive/poll.js')
const feed = require('./passive/feed.js')

const pollChannel = '663484449576714252'

cron.schedule('*/5 * * * * *', () => {
    feed.execute(client)
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const prefix = '!'

client.once('ready', () => {
    console.log('Bot is now running.')
})

client.on('message', (message) => {
    if(message.author.bot){
        return
    }

    if(message.channel.id === pollChannel){
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
            //message.channel.send("Invalid command! Do `!help` for a list of commands.")
            break

    }
})

//Keep it last line.
client.login(process.env.CLIENT_TOKEN)