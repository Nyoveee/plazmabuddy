require('dotenv').config()

const Discord = require('discord.js')
const fetch = require('node-fetch');
const apiKey = process.env.API_KEY

const verifyChannel = '501506791381663754'

const verifyUser = (message, login) => {
    //If discord tag is the same as login, add a . for nickname.
    if(message.author.username === login){
        login += '.'
    }

    let user = message.member

    //Add Verified Role, Remove New User Role.
    //-----
    const newUserRole = message.guild.roles.cache.find(role => role.name === 'New User');
    const verifiedRole = message.guild.roles.cache.find(role => role.name === 'Verified');

    if(newUserRole === undefined || verifiedRole === undefined){
        message.channel.send('Failed to retrieve role names. Verification process halted.')
        console.error('\x1b[33m%s\x1b[0m','Failed to retrieve role names during verification process. Role names may have changed?')
        return
    }

    user.roles.add(verifiedRole).catch(() => {
        message.channel.send('Bot has invalid permissions to add Verified role. Please allocate the proper permissions for the bot.')
        console.error('\x1b[33m%s\x1b[0m','Bot has invalid permissions to add Verified role.')
    });

    user.roles.remove(newUserRole).catch(() => {
        message.channel.send('Bot has invalid permissions to remove New User role. Please allocate the proper permissions for the bot.')
        console.error('\x1b[33m%s\x1b[0m','Bot has invalid permissions to add New User role.')
    });

    console.log("Roles successfully added.")
    //-----
    
    user.setNickname(login).catch(error => {
        message.channel.send('Bot has invalid permissions to change nickname. Please allocate the proper permissions for the bot.')
        console.error('\x1b[33m%s\x1b[0m','Bot has invalid permissions to change nickname.')
    })

    message.channel.send(`Congratulations! You've been verified as \`${login}\`! You now have access to some new features.`)
    console.log(`Successfully verified user ${login}.`)
}

const missingLogin = (message, command) => {
    const missingLoginEmbed = new Discord.MessageEmbed()
    .setColor('#FFFF00')
    .setTitle('Missing Login')
    .setDescription(`Please include login after the command.\nExample: \`!${command} Your Login Here\`\n\nYou can find out what is your login here: https://www.plazmaburst2.com/?a=&s=8.`)
    .setImage('https://i.imgur.com/gPJgTt8.png')

    message.channel.send(missingLoginEmbed)
}

const invalidLogin = (message, command) => {
    const invalidLoginEmbed = new Discord.MessageEmbed()
    .setColor('#FFFF00')
    .setTitle('Invalid Login')
    .setDescription(`You can find out what is your login here: https://www.plazmaburst2.com/?a=&s=8. \n\nExample: \`!${command} Your Login Here\``)
    .setImage('https://i.imgur.com/gPJgTt8.png')
      
    message.channel.send(invalidLoginEmbed)
}

const missingDiscordTag = (message, discordTag, profileTag) => {
    let title = ''
    let description = ''

    if(profileTag === '') {
        profileTag = '{Empty}'
        title = 'Missing Discord Tag on PB2 Profile'
        description = 'Please put your discord tag on your PB2 profile.\n\nPut your discord tag on your edit profile here https://www.plazmaburst2.com/?a=&s=8\n\u200B'
    }
    else{
        title = 'Invalid Discord Tag On PB2 Profile'
        description = 'Discord tag on your PB2 profile does not match your actual discord tag.\n\nEdit your discord tag on your edit profile here https://www.plazmaburst2.com/?a=&s=8\n\u200B'
    }

    const missingTagEmbed = new Discord.MessageEmbed()
    .setColor('#FFFF00')
    .setTitle(title)
    .setDescription(description)
    .addFields(
        {name: 'Your discord tag', value: discordTag, inline: true},
        {name: 'Discord tag on your profile', value: profileTag, inline: true},
    )
    .setImage('https://i.imgur.com/AJ0CRZ1.png')

    message.channel.send(missingTagEmbed)
}

const failedReq = (message) => {
    const veriDenyEmbed = new Discord.MessageEmbed()
    .setColor('#FFFF00')
    .setTitle('Verification requirements not met.')
    .setDescription('To be verified, you need to meet at least one of the criteria stated below.')
    .addFields(
        { name: 'Account age', value: '=> 14 days', inline: true },
        { name: 'Kills', value: '=> 200 kills', inline: true },
        { name: 'LDR', value: '=> 7.5 LDR', inline: true },
    )

    message.channel.send(veriDenyEmbed)
}

module.exports = {
    name: 'verify',
    description: 'Process of verifying user.',
    //Entry point
    execute: (message, args, command) => {
        if(message.channel.id !== verifyChannel){
            return
        }

        //Missing argument event
        if(args.length === 0){
            missingLogin(message, command)
            return
        }

        //Combine the rest of the elements of array into one login (useful when user login has spaces.)
        let login = args.join(' ')

        //A single # character will ruin API link.
        if(login.match(/#/)){
            invalidLogin(message, command)
            return
        }

        const api = `https://www.plazmaburst2.com/extract.php?login=${login}&api_key=${apiKey}`

        fetch(api)
        .then(res => res.json())
        .then(json => {
            if("Error" in json){
                invalidLogin(message, command)
                return
            }

            const secondsSinceEpoch = Math.round(Date.now() / 1000)
            const accountAge = secondsSinceEpoch - json['real_register']
            
            const accountDayAge = Math.floor(accountAge / 86400)

            if(json['s_kills'] < 100 && json['dev_rank'] < 7.5 && accountDayAge < 14){
                failedReq(message)
                return
            }

            const discordTag = message.member.user.tag

            if(json['icq'] !== discordTag){
                missingDiscordTag(message, discordTag, json['icq'])
                return
            }

            verifyUser(message, login)
            
        })
        .catch(error => {
            console.error('\x1b[33m%s\x1b[0m',`Error when verifying user. ${error}`)
        })
    }
}

