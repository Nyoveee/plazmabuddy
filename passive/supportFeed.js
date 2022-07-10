const log = require('../lib/log.js')
const fetch = require('node-fetch');

supportTicketURL = 'https://www.plazmaburst2.com/helpdesk/staff/tickets'

module.exports = {
    name: 'supportFeed',
    execute: (client) => {
        fetch()
        .then(response => response.text())
        .then(text => {
            
        })
        .catch(err => {
            log.log(`Failed to retrieve support ticket.\n${err}`)
        })
    }

}