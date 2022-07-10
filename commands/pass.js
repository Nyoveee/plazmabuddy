const Discord = require('discord.js')
require('dotenv').config()

module.exports = {
    name: 'pass',
    description: 'Command to display help for password reset related enquiries.',
    execute: (message) => {
        const description = 'You can try to reset your password here: https://www.plazmaburst2.com/?a=&s=19'

        const embed = new Discord.MessageEmbed()
        .setColor(process.env.embedColor)
        .setTitle('Forgot your password?')
        .setDescription(description)
        .setTimestamp()
        .addFields(
            {name: 'Ping a staff member for help if it doesn\'t work.', value: 'You need to have access to your email address you used to register with your account.\n\n**The staff team will never ask for your password.**'},
        )
        .setFooter({text: process.env.embedFooter})
        .setThumbnail('https://i.imgur.com/PBuRnNa.png')

        message.channel.send({embeds: [embed]})
    }
}