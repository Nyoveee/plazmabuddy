module.exports = {
    name: 'ping',
    description: 'Ping command to see latency and whether the bot is online.',
    execute: (message, client) => {
        message.channel.send(`Pong!`).then(m => {
            //m is the sent message, message is the received message
            const ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`Pong! \`${ping}ms\``).catch(error => {
                message.channel.send("Insufficient permission to edit message to include ping latency.")
                .catch( function(err){console.error(`Error sending message at ${this.name}.js file.\n${err}`)})

                log.error("Error in editing message for ping.js\n" + error, message)
            })
        })
    }
}