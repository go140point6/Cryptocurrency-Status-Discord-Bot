require('dotenv').config() // Load .env file
const axios = require('axios')
const { Client, Intents } = require('discord.js')

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS)

// Create a new client instance
const client = new Client({ intents: myIntents })

const up = "\u2B08"
const down = "\u2B0A"
const mid = "\u22EF"

var lastPrice
var currentPrice
var arrow

async function clearRoles () {
  const guild = client.guilds.cache.get(`${process.env.SERVER_ID}`)
  if(!guild) {
    try {
      const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the guild: `, error)
    }
  }

  const red = guild.roles.cache.find(role => role.name === 'tickers-red')
  if(!red) {
    try {
      const red = await guild.roles.cache.find(role => role.name === 'tickers-red')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const green = guild.roles.cache.find(role => role.name === 'tickers-green')
  if(!green) {
    try {
      const green = await guild.roles.cache.find(role => role.name === 'tickers-green')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const member = guild.members.cache.get(`${process.env.BOT_ID}`)
  if(!member) {
    try {
      member = await guild.members.fetch(`${process.env.BOT_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the member: `, error)
    }
  }

  member.roles.remove(red) && member.roles.remove(green)
}

async function setRed () {
  const guild = client.guilds.cache.get(`${process.env.SERVER_ID}`)
  if(!guild) {
    try {
      const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the guild: `, error)
    }
  }

  const red = guild.roles.cache.find(role => role.name === 'tickers-red')
  if(!red) {
    try {
      const red = await guild.roles.cache.find(role => role.name === 'tickers-red')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const green = guild.roles.cache.find(role => role.name === 'tickers-green')
  if(!green) {
    try {
      const green = await guild.roles.cache.find(role => role.name === 'tickers-green')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const member = guild.members.cache.get(`${process.env.BOT_ID}`)
  if(!member) {
    try {
      member = await guild.members.fetch(`${process.env.BOT_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the member: `, error)
    }
  }

  if(red) {
    member.roles.add(red) && member.roles.remove(green)
  }
}

async function setGreen () {
  const guild = client.guilds.cache.get(`${process.env.SERVER_ID}`)
  if(!guild) {
    try {
      const guild = await client.guilds.fetch(`${process.env.SERVER_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the guild: `, error)
    }
  }

  const red = guild.roles.cache.find(role => role.name === 'tickers-red')
  if(!red) {
    try {
      const red = await guild.roles.cache.find(role => role.name === 'tickers-red')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const green = guild.roles.cache.find(role => role.name === 'tickers-green')
  if(!green) {
    try {
      const green = await guild.roles.cache.find(role => role.name === 'tickers-green')
    } catch (error) {
      return console.log(`Error while fetching the role: `, error)
    }
  }

  const member = guild.members.cache.get(`${process.env.BOT_ID}`)
  if(!member) {
    try {
      member = await guild.members.fetch(`${process.env.BOT_ID}`)
    } catch (error) {
      return console.log(`Error while fetching the member: `, error)
    }
  }

  if(green) {
    member.roles.add(green) && member.roles.remove(red)
  }
}

function getInitialPrice() {
  //API for price data
  axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${process.env.PREFERRED_CURRENCY}&ids=${process.env.COIN_ID}`).then(res => {
    // If we got a valid response
    if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
      clearRoles()
      lastPrice = res.data[0].current_price.toFixed(4) || 0 // Default to zero
      let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero
      let symbol = res.data[0].symbol || '?'
      client.user.setPresence({
        activities: [{
          name: `24hr: ${priceChange.toFixed(2)}%`,
          type: `WATCHING`
          }]
        })

        arrow = mid
        client.guilds.cache.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`${symbol.toUpperCase()} ${arrow} ${process.env.CURRENCY_SYMBOL}${lastPrice}`)

    //console.log('Initial price to', lastPrice)
    //console.log('priceChange 24h is', priceChange)
    //console.log('symbol is', symbol)
    }
    else
      console.log('Could not load player count data for', process.env.COIN_ID)

  }).catch(err => console.log('Error at api.coingecko.com data:', err))
}

function getPrices() {
  //API for price data
  axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${process.env.PREFERRED_CURRENCY}&ids=${process.env.COIN_ID}`).then(res => {
    // If we got a valid response
    if(res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
      currentPrice = res.data[0].current_price.toFixed(4) || 0 // Default to zero
      let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero
      let symbol = res.data[0].symbol || '?'
      client.user.setPresence({
        activities: [{
          name: `24hr: ${priceChange.toFixed(2)}%`,
          type: `WATCHING`
          }]
        })

      if (currentPrice > lastPrice) {
        //console.log('up')
        arrow = up
        setGreen()
        } else if (currentPrice < lastPrice) {
          //console.log('down')
          arrow = down
          setRed()
        } else {
          //console.log('same')
        }

        client.guilds.cache.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`${symbol.toUpperCase()} ${arrow} ${process.env.CURRENCY_SYMBOL}${currentPrice}`)
        //console.log('Current price to', lastPrice)
        //console.log('priceChange 24h is', priceChange)

        lastPrice = currentPrice

    }
    else
      console.log('Could not load player count data for', process.env.COIN_ID)

  }).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
  console.log('Logged in as', client.user.tag)
  getInitialPrice() // Ping server once on startup
  // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
  setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
