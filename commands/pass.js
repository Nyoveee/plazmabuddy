const Discord = require('discord.js')

module.exports = {
    name: 'pass',
    description: 'Command to display help for password reset related enquiries.',
    execute: (message) => {
        const description = 'If you still have access to the email you used to register with the account, you can try to reset your password here: https://www.plazmaburst2.com/?a=&s=19\n\u200B'

        const embed = new Discord.MessageEmbed()
        .setColor('#FFFF00')
        .setTitle('Forgot your password?')
        .setDescription(description)
        .setTimestamp()
        .setFooter('Consider supporting PB2 today!')
        .addFields(
            { name: 'Forgot login / still having issues?', value: 'You can raise a support ticket at https://www.plazmaburst2.com/support (please provide email on ticket).\n\nPlease note that if you do not have access to the email, the staff team is unable to recover your account.\n\n**The staff team will never ask for your password.**'},
        )
        .setThumbnail('https://i.imgur.com/PBuRnNa.png')

        message.channel.send(embed)
    }
}