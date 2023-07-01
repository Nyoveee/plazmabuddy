require('dotenv').config()

const fetch = require('node-fetch');
const RSS_URL = 'https://www.plazmaburst2.com/forum/feed.php';
const feedChannel = process.env.feedChannel
const Discord = require('discord.js')
const apiKey = process.env.API_KEY
const he = require('he');
const quoteFac = require('../lib/quote.js')
const log = require('../lib/log.js')
const parseString = require('xml2js').parseString;
let memoryFeed = ''
let prevFeed = ''

const regexFilter = /.+?• ?(.+)/
const contentRegexFilter = /((?:.|\s)+)<p>Statistics: Posted by <a/
const emojiRegexFilter = /<img src="http:\/\/www\.plazmaburst2\.com\/forum\/images\/smilies\/kolobok\/(.+?)" alt=".+?" title=".+?" \/>/g
const bbcodeFilter = /\<\/?(?:strong|!-- m --|a|code|dd|dl(?: class="codebox")?|dt|div|span(?: style=".*?")?)\>/g
const imgRegex = /<a class="postlink" href=".+?" >/g
const maskedLink = /<a\s?(?:class="postlink")?\s?href="(.+?)"\s+>?(?:class="postlink">)?(.+?)<\/a>/g
const localLink = /<!-- l --><a class="postlink-local" href="(.+?)"\s+>(?:.+)?<\/a><!-- l -->/g

//const testString = "Nyove wrote: \nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."

const emojiMap = {
    'biggrin.gif': '😆',
    'cool.gif': '😎',
    'happy.gif': '😊',
    'nea.gif': '😞',
    'rolleyes.gif': '🙄',
    'sad.gif': '😔',
    'shok.gif': '😲',
    'smile.gif': '🙂',
    'sorry.gif': '🥺',
    'thank.gif': '😄',
    'tongue.gif': '😛',
    'wink.gif': '😉',
}

const sendFeedEmbed = (client, color, imgLink, title, postLink, content, category, author) => {
    const file = new Discord.MessageAttachment(`./images/${imgLink}`)

    const feedEmbed = new Discord.MessageEmbed()
    .setTitle(`${category} • ${title}`)
    .setColor(color)
    .setURL(postLink)
    .setDescription(`${content}`)
    .setThumbnail(`attachment://${imgLink}`)
    // .addFields(
    //     { name: 'Category', value: category },
    //     { name: 'Author', value: author},
    // )
    .setTimestamp()
    .setAuthor({name: author, iconURL: `attachment://${imgLink}`})
    .setFooter({text: process.env.embedFooter})

    client.channels.cache.get(feedChannel).send({embeds: [feedEmbed], files: [file] })
    .then(async m => {
        await m.react('✅')
        m.react('❌')
    })
    .catch( function(err){console.error(`Error sending message at feed.js file.\n${err}`)})
}

module.exports = {
    name: 'feed',
    execute: (client) => {
        fetch(RSS_URL)
        .then(response => response.text())
        .then(xml => {
            //Empty messages are single space after .text(). Bug occurs when URL was accidentally modified.
            if(xml === " "){
                log.error(`Empty response from PB2 API. Perhaps URL got changed?\n${RSS_URL}`, client)
                return
            }

            parseString(xml, (err, result) => {
                if(err){
                    log.error(`Error parsing feeds into an xml.\n${err}`, client)
                    return
                }

                //Latest Feed
                let latestEntry = result.feed.entry[0]
                //We use published time to check whether this feed is a new one
                let latestEntryTime = latestEntry.published[0]

                //Latest feed is the same as the one in memory? If it is, skip this step.
                //MemoryFeed is initialised as '' in the beginning.
                if(memoryFeed !== '' && memoryFeed === latestEntryTime){
                    return
                }
                
                //If previous feed === latest feed, that means the latest feed has been deleted. Ignore it (so you dont make a duplicate post of the previous one.)
                if(latestEntryTime === prevFeed){
                    memoryFeed = latestEntryTime
                    return
                }

                //Reaching here, latest feed is a new one.
                
                //Keep a copy of the previous feed
                prevFeed = memoryFeed

                //Save new feed to memory
                memoryFeed = latestEntryTime

                //Extracting data from object structure
                let author = latestEntry.author[0].name[0]
                let title = latestEntry.title[0]._.match(regexFilter)[1]
                let postLink = latestEntry.id[0]
                let category = latestEntry.category[0].$.label
                let content = latestEntry.content[0]._.match(contentRegexFilter)[1]

                log.log(`Successfully retrieved a feed from ${author}.`, client)

                //content = testString
                // ------ Cleaning content ------
                //2. Convert <br /> to newlines
                content = content.replace(/<br \/>/g, "\n");

                let emojiList = []

                //3. Convert emojis from img to unicode emojis
                //3.1 First, extract the list of emojis used in order.
                for(const arr of Array.from(content.matchAll(emojiRegexFilter))){
                    emojiList.push(arr[1])
                }

                //3.2 Replace img link with unicode emoji
                if(emojiList.length !== 0){
                    for(const emojiLink of emojiList){
                        let emojiRegex = new RegExp(`<img src="http:\/\/www\.plazmaburst2\.com\/forum\/images\/smilies\/kolobok\/${emojiLink}" alt=".+?" title=".+?" \/>`)
                        content = content.replace(emojiRegex, emojiMap[emojiLink])
                    }
                }

                //4. Masked link
                listOfLinks = Array.from(content.matchAll(maskedLink))

                for(let linkCaptureGroup of listOfLinks){
                    let mask = linkCaptureGroup[2]
                    let url = linkCaptureGroup[1]

                    if(mask.includes('www.') || mask.includes('https://')){
                        content = content.replace(linkCaptureGroup[0], url)
                    }

                    content = content.replace(linkCaptureGroup[0],`[${mask}](${url})`)
                }

                //4.5 Local links
                listOfLinks = Array.from(content.matchAll(localLink))

                for(let linkCaptureGroup of listOfLinks){
                    content = content.replace(linkCaptureGroup[0],linkCaptureGroup[1])
                }

                //5. Remove all BBcode tags styling.
                content = content.replace(bbcodeFilter, '')
                content = content.replace(imgRegex, '')
                
                //6. Style quotes
                content = quoteFac.styleQuote(content)

                //7. Change HTML entities like < > to their respective characters. (Safe to assume that discord embeds are safe from XSS vulnerability, right?)
                content = he.decode(content)                

                //This part shouldn't run, but as a failsafe if content after styling quote is still > 2048.
                if(content.length > 2048){
                    content = content.slice(0, 2045);
                    content += '...'
                }
                // ------ End of cleaning content ------

                const api = `https://www.plazmaburst2.com/extract.php?login=${author}&api_key=${apiKey}`

                //Fetch data about user (icon, rank)
                fetch(api)
                .then(res => res.json())
                .then(json => {
                    let color = "#f1c40f"
                    
                    if(json.chat_admin === '1'){
                        color = "#FF0000"
                    }
                    else if(json.chat_moderator === '1'){
                        color = "#58faf4"
                    }
                    else if(json.chat_moderator === '2'){
                        color = "#33aaff"
                    }

                    json.mdl = json.mdl.padStart(4, '0')
                    let imgLink = `${json.mdl}.png`;

                    sendFeedEmbed(client, color, imgLink, title, postLink, content, category, author)
                })
                .catch(err => {
                    //API failed to respond.
                    log.error(`PB2 API failed to respond [1]. Error message:\n${err}`, client)
                })
            })
        })
        .catch(err => {
            //Feeds failed to respond.
            log.error(`PB2 Feeds failed to respond [2]. Error message:\n${err}`, client)
        })
    }
}