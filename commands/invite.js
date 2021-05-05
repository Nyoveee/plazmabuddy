const serverLink = 'https://discord.com/invite/Bhe9rNz'

module.exports = {
    name: 'invite',
    description: 'Shows a list of command',
    execute(message){
        message.channel.send(serverLink)
    }
}