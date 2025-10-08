const Discord = require('discord.js')

module.exports = {
    name: 'patreon',
    description: 'A command to subscribe to eric!',

    execute: (message) => {
        const file = new Discord.MessageAttachment(`./images/patreon.png`)
        const filename = "patreon.png"

        const feedEmbed = new Discord.MessageEmbed()
            .setTitle(`Subscribe to Eric's Patreon!`)
            .setColor("#58faf4")
            .setURL("https://www.patreon.com/Eric_Gurt")
            .setDescription(`Support Eric's patreon! Supporters now gain access to PB3's closed beta!`)
            .setThumbnail(`attachment://${filename}`)
            .setTimestamp()
            .setAuthor({name: "PlazmaBot", iconURL: `attachment://${filename}`})

            // .setFooter({text: process.env.embedFooter})

        message.channel.send({embeds: [feedEmbed], files: [file] })
        .then(async m => {
            m.react('🥳')
        })
    }
}