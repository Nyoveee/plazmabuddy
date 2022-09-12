const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    name: 'help',
    description: 'Shows a list of command',
    execute(message){
        const helpEmbed = new Discord.MessageEmbed()
        .setColor(process.env.embedColor)
        .setTitle('General Information')
        .setDescription('The PlazmaBuddy bot helps the staff team to automate certain tasks such as verification, emoji reactions, etc..\n\nHere are the list of commands.')
        .addFields(
            { name: '!help', value: 'Displays this very message.'},
            { name: '!ping', value: 'Check if bot is online.'},
            { name: '!general', value: 'Fun command; gets a random annoucement-related message.'},
            { name: '!link', value: 'Helps to verify new users. Only usable in #verify-here.'},
            { name: '!pass', value: 'Guide for account recovery.'},
            { name: '!invite', value: 'Get server invite link.'},
            { name: 'Source code', value: 'https://github.com/Nyoveee/plazmabuddy'},
        )
        .setTimestamp()
        .setFooter({text: process.env.embedFooter})
        .setThumbnail('https://i.imgur.com/rCvjGc2.png')

        message.channel.send({embeds: [helpEmbed]}).catch(err => console.error(err))
        .catch( function(err){console.error(`Error sending message at ${this.name}.js file.\n${err}`)})
    }
}