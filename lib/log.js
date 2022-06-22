require('dotenv').config()

//msg is either message or client
const addZero = (i) => {
    if (i < 10) {i = "0" + i}
    return i;
}

const getDateAndTime = (date) => {
    return `[${date.getFullYear()}/${addZero(date.getMonth() + 1)}/${addZero(date.getDate())} ${addZero(date.getHours())}:${date.getMinutes()}:${addZero(date.getSeconds())}]`
}

module.exports = {
    description: "Logging discord logs",
    log: (message, msg) => {
        console.log(message)
        let date = new Date()

        //is message
        if(msg.client){
            msg.client.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [LOG] ${message}`)
            return
        }
        //is client
        msg.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [LOG] ${message}`)
    },
    error: (message, msg) => {
        console.error('\x1b[33m%s\x1b[0m', message)
        let date = new Date()

        //is message
        if(msg.client){
            msg.client.channels.cache.get(process.env.logChannelID).send(`**${getDateAndTime(date)} [ERROR] ${message}**`)
            return
        }
        //is client
        msg.channels.cache.get(process.env.logChannelID).send(`**${getDateAndTime(date)} [ERROR] ${message}**`)
    },
}