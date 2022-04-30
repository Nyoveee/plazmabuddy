const listOfSentence = [
    'Want to support PB2? You can now donate money to keep the PB2 servers running by going to https://www.plazmaburst2.com/?a=&s=21',
    'Caught anyone breaking the rules? Please take a screenshot and send it to a staff member!',
    'Want to interact with the community? Participate in the forums!',
    'You can now show your support to Eric Gurt by subscribing to his patreon at https://www.patreon.com/Eric_Gurt',
    'Have any art you want to showcase? Post in the forums at https://www.plazmaburst2.com/forum/index.php',
]

let memoryList = []
module.exports = {
    name: 'general',
    description: 'A fun command!',
    execute: (message) => {
        if(memoryList.length === 0){
            memoryList = listOfSentence.slice()
        }

        const randomIndex = Math.floor(Math.random() * memoryList.length)
        message.channel.send(memoryList[randomIndex])

        memoryList.splice(randomIndex,1)
    }
}