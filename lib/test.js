require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

const e = require('./emoji.js')

client.once('ready', () => {
    console.log('Bot is now running.')
})

client.on('message', (message) => {
    if(message.author.bot){
        return
    }

    emojiArr = e.extractEmoji(message.content)
    console.log(emojiArr)
})

//Keep it last line.
client.login(process.env.CLIENT_TOKEN)