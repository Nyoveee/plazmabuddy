const serverLink = 'https://discord.gg/dw32bAV9Eb'

module.exports = {
    name: 'invite',
    description: 'Shows a list of command',
    execute(message){
        message.channel.send(serverLink)
        .catch( function(err){console.error(`Error sending message at ${this.name}.js file.\n${err}`)})
    }
}