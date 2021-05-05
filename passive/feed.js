require('dotenv').config()

const fetch = require('node-fetch');
const RSS_URL = 'https://www.plazmaburst2.com/forum/feed.php';
//const RSS_URL = ' www.google.com:81'
const feedChannel = '335859989258174464'
const Discord = require('discord.js')
const apiKey = process.env.API_KEY
const he = require('he');
const quoteFac = require('../lib/quote.js')

const parseString = require('xml2js').parseString;
let memoryFeed = ''
let prevFeed = ''

const regexFilter = /.+?• ?(.+)/
const contentRegexFilter = /((?:.|\s)+)<p>Statistics: Posted by <a/
const emojiRegexFilter = /<img src="https:\/\/www.plazmaburst2.com\/forum\/images\/smilies\/kolobok\/([a-z]+\.gif)"/g
const bbcodeFilter = /\<\/?(?:strong|!-- m --|a|code|dd|dl(?: class="codebox")?|dt|div|span(?: style=".*?")?)\>/g
const imgRegex = /<a class="postlink" href=".+?" >/g

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
    const feedEmbed = new Discord.MessageEmbed()
    .setTitle(`${category} • ${title}`)
    .setColor(color)
    .setURL(postLink)
    .setDescription(`${content}`)
    .setThumbnail(imgLink)
    // .addFields(
    //     { name: 'Category', value: category },
    //     { name: 'Author', value: author},
    // )
    .setTimestamp()
    .setAuthor(author, imgLink)
    .setFooter('Consider supporting PB2 today!')

    client.channels.cache.get(feedChannel).send(feedEmbed)
    .then(async m => {
        await m.react('✅')
        m.react('❌')
    })
}

module.exports = {
    name: 'feed',
    execute: (client) => {
        fetch(RSS_URL)
        .then(response => response.text())
        .then(xml => {
            parseString(xml, (err, result) => {
                if(err){
                    console.error('\x1b[33m%s\x1b[0m',"Error parsing feeds into an xml.")
                    return
                }

                //Latest Feed
                let latestEntry = result.feed.entry[0]
                //We use published time to check whether this feed is a new one or not
                let latestEntryTime = latestEntry.published[0]

                //Latest feed is the same as the one in memory? If it is, skip this step.
                //MemoryFeed starts off as ''
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

                console.log(`Successfully retrieved a feed from ${author}`)

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
                        content = content.replace(/<img src="https:\/\/www.plazmaburst2.com\/forum\/images\/smilies\/kolobok\/[a-z]+\.gif" alt=".+?" title=".+?" \/>/, emojiMap[emojiLink])
                    }
                }

                //4. Remove all BBcode tags styling.
                content = content.replace(bbcodeFilter, '')
                content = content.replace(imgRegex, '')
                
                //5. Style quotes
                content = quoteFac.styleQuote(content)

                //6. Change HTML entities like < > to their respective characters. (Safe to assume that discord embeds are safe from XSS vulnerability, right?)
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

                    let imgLink = ''
                    intMdl = parseInt(json.mdl)
                    json.mdl = json.mdl.padStart(4, '0')

                    if (intMdl >= 41 && intMdl <= 49) {
                        stringMdl = (intMdl - 40).toString()
                        stringMdl = stringMdl.padStart(4, '0')
                        imgLink = `http://mcshroom.com/pb2characters/pb2characters/chars_hero${stringMdl}.jpg`;
                    } 
                    else if (intMdl === 61) {
                        imgLink = "http://mcshroom.com/pb2characters/pb2characters/chars_proxy.jpg";
                    } 
                    else {
                        imgLink = `http://mcshroom.com/pb2characters/pb2characters/chars${json.mdl}.jpg`;
                    }

                    sendFeedEmbed(client, color, imgLink, title, postLink, content, category, author)
                })
                .catch(err => {
                    //API failed to respond.
                    console.log('\x1b[33m%s\x1b[0m', 'PB2 API failed to respond properly. Error message:\n' + err)
                })
            })
        })
        .catch(err => {
            //Feeds failed to respond.
            console.log('\x1b[33m%s\x1b[0m', 'PB2 Feeds failed to respond properly. Error message:\n' + err)
        })
    }
}