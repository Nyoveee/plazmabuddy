require('dotenv').config()

//msg is either message or client
const addZero = (i) => {
    if (i < 10) {i = "0" + i}
    return i;
}

module.exports = {
    description: "Logging discord logs",
    log: (message, msg) => {
        console.log(message)
        let date = new Date()

        //is message
        if(msg.client){
            msg.client.channels.cache.get(process.env.logChannelID).send(`[${date.getHours()}:${date.getMinutes()}:${addZero(date.getSeconds())}] [LOG] ${message}`)
            return
        }
        //is client
        msg.channels.cache.get(process.env.logChannelID).send(`[${date.getHours()}:${date.getMinutes()}:${addZero(date.getSeconds())}] [LOG] ${message}`)
    },
    error: (message, msg) => {
        console.error('\x1b[33m%s\x1b[0m', message)
        let date = new Date()

        //is message
        if(msg.client){
            msg.client.channels.cache.get(process.env.logChannelID).send(`**[${date.getHours()}:${date.getMinutes()}:${addZero(date.getSeconds())}] [ERROR] ${message}**`)
            return
        }
        //is client
        msg.channels.cache.get(process.env.logChannelID).send(`**[${date.getHours()}:${date.getMinutes()}:${addZero(date.getSeconds())}] [ERROR] ${message}**`)
    },
}