require('dotenv').config()

//msg is either message or client
const addZero = (i) => {
    if (i < 10) {i = "0" + i}
    return i;
}

const getDateAndTime = (date) => {
    return `[${date.getFullYear()}/${addZero(date.getMonth() + 1)}/${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}]`
}

module.exports = {
    name: "log",
    description: "Logging discord logs",
    log: (message, msg) => {
        console.log(message)

        try{
            let date = new Date()

            //Either Message or Client is passed in 2nd argument. To check if it is Message or Client, check if property exist.
            //Structure goes like this Message.Client.Channels...
            if(msg.client){
                msg = msg.client
            }

            msg.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [LOG] ${message}`)
            .catch( function(err){console.error(`Error sending message at ${this.name}.js file.\n${err}`)})
        }
        catch(error){
            console.error('\x1b[33m%s\x1b[0m', `Error while sending logs to channel.\n${error}`)
        }

    },
    error: (message, msg) => {
        console.error('\x1b[33m%s\x1b[0m', message)

        try{
            let date = new Date()

            //Either Message or Client is passed in 2nd argument. To check if it is Message or Client, check if property exist.
            //Structure goes like this Message.Client.Channels...
            if(msg.client){
                msg = msg.client
            }

            msg.channels.cache.get(process.env.logChannelID).send(`${getDateAndTime(date)} [ERROR] ${message}`)
            .catch( function(err){console.error(`Error sending message at ${this.name}.js file.\n${err}`)})
        }
        catch(error){
            console.error('\x1b[33m%s\x1b[0m', `Error while sending error logs to channel.\n${error}`)
        }
    },
}