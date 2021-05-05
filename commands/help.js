const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Shows a list of command',
    execute(message){
        const helpEmbed = new Discord.MessageEmbed()
        .setColor('#FFFF00')
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
        .setFooter('Consider supporting PB2 today!')
        .setThumbnail('https://i.imgur.com/PBuRnNa.png')

        message.channel.send(helpEmbed)
    }
}