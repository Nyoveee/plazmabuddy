//Regex for unicode is referenced from here: https://www.codegrepper.com/code-examples/javascript/detect+emoji+in+string+javascript
const customEmojiRegex = /<:.+?:\d+>|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gm

module.exports = {
    description: "A function that extracts BOTH unicode and custom emoji from a given String, and returns an String array of emojis.",
    extractEmoji: msgContent => {
        const listOfEmojisArr = Array.from(msgContent.matchAll(customEmojiRegex))

        let listOfEmoji = []

        for(const emojiArr of listOfEmojisArr){
            listOfEmoji.push(emojiArr[0])
        }

        return listOfEmoji
    }
}

/*
How to use
1. Download this file
2. On your other js file, on top of the file, do
const e = require(path_to_emoji.js)

3. You can then use the extractEmoji function anytime you need it
emojiArr = e.extractEmoji(message.content)

4. Print out the array to see how it looks like
console.log(emojiArr)

You can now extract the individual emojis in the array and do message.channel.send(emoji)

Do note that message.react takes in ONLY the ID of a custom emoji, so you will have to further perform regex on custom emojis
*/