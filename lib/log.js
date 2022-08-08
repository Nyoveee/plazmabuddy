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

        try{
            let date = new Date()

            //is message
            if(msg.client){
                msg.client.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [LOG] ${message}`)
                return
            }
            //is client
            msg.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [LOG] ${message}`)
        }
        catch(error){
            console.error('\x1b[33m%s\x1b[0m', `Error while sending logs to channel.\n${error}`)
        }

    },
    error: (message, msg) => {
        console.error('\x1b[33m%s\x1b[0m', message)

        try{
            let date = new Date()

            //is message
            if(msg.client){
                msg.client.channels.cache.get(process.env.logChannelID).send(`**${getDateAndTime(date)} [ERROR] ${message}**`)
                return
            }
            //is client
            msg.channels.cache.get(process.env.logChannelID).send(`**${getDateAndTime(date)} [ERROR] ${message}**`)
        }
        catch(error){
            console.error('\x1b[33m%s\x1b[0m', `Error while sending error logs to channel.\n${error}`)
        }
    },
}