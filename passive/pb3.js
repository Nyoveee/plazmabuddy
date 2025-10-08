module.exports = {
    execute: (message) => {
        const regex = /where|when('s)?\s+pb3|plazma\s?burst\s?3/gmi; 
    
        if (!regex.test(message.content)) {
            return
        } 

        message.channel.send("PB3? Just subscribe to [Eric's patreon](<https://www.patreon.com/cw/Eric_Gurt>) to gain beta access! 😉")
    }
}