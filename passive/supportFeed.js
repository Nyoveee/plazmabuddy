const log = require('../lib/log.js')
const fetch = require('node-fetch');
require('dotenv').config()

memoryFeed = ''

const queryListOfTickets = (client) => {
    listOfTicketsAPI = "https://www.plazmaburst2.com/helpdesk/api/tickets"

    fetch(listOfTicketsAPI, { headers: {'status_id': 1, 'Token': process.env.supportAPIKey}})
    .then(response => response.json())
    .then(json => {
        sendFeedToChannel(json, client)
    })
    .catch(err => {
        log.log(`Failed to retrieve support ticket.\n${err}`, client)
    })
}

const sendFeedToChannel = (json, client) => {
    console.log(json)    
    let latestEntry = json["tickets"][0]

    //Latest feed is the same as the one in memory? If it is, skip this step.
    //MemoryFeed is initialised as '' in the beginning.
    if(memoryFeed !== '' && memoryFeed === latestEntry){
        return
    }

    //Save new feed to memory
    memoryFeed = latestEntry
}

module.exports = {
    name: 'supportFeed',
    execute: (client) => {
        queryListOfTickets(client)
    }

}