require('dotenv').config() // Load .env file
require('log-timestamp')
const axios = require('axios')
const { Client, Intents } = require('discord.js')

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS)

// Create a new client instance
const client = new Client({ intents: myIntents })

const up = "\u2B08"
const down = "\u2B0A"
const mid = "\u22EF"

var guild
var lastPrice
var currentPrice
var arrow
var red
var green
var member

async function getStuff() {
  guild = await client.guilds.cache.get(`${process.env.SERVER_ID}`)
  //console.log(guild)
  member = await guild.members.cache.get(`${process.env.BOT_ID}`)
  //console.log(member)
  red = await guild.roles.cache.find(role => role.name === 'tickers-red')
  //console.log(red)
  green = await guild.roles.cache.find(role => role.name === 'tickers-green')
  //console.log(green)
}

async function clearRoles() {
  await getStuff()
  let redRole = await member.roles.cache.some(role => role.name === ('tickers-red'))
  let greenRole = await member.roles.cache.some(role => role.name === ('tickers-green'))
  //console.log(redRole)
  //console.log(greenRole)
  if (redRole) {
    try {
      await (member.roles.remove(red))
    } catch (err) {
      console.log('Unable to clear RED role ', err)
      }
  }
  if (greenRole) {
    try {
      await (member.roles.remove(green))
    } catch (err) {
      console.log('Unable to clear GREEN role ', err)
      }
  }
}

async function setRed() {
  console.log('Setting Red Role Now...')
  await getStuff()
  let redRole = await member.roles.cache.some(role => role.name === ('tickers-red'))
  console.log('redRole is:', redRole)
  let greenRole = await member.roles.cache.some(role => role.name === ('tickers-green'))
  console.log('greenRole is:', greenRole)
  if (!redRole) {
    console.log ('redRole is false, so add...')
    try {
      await (member.roles.add(red))
      let redRole = await member.roles.cache.some(role => role.name === ('tickers-red'))
      console.log ('Attempted adding of redRole, if successful, this should be true:', redRole)
    } catch (err) {
      console.log('Unable to add RED role', err)
      }
  }
  if (greenRole) {
    console.log ('greenRole is true, so remove...')
    try {
      await (member.roles.remove(green))
      let greenRole = await member.roles.cache.some(role => role.name === ('tickers-green'))
      console.log ('Attempted removal of greenRole, if successful, this should be false:', greenRole)
    } catch (err) {
      console.log('Unable to remove GREEN role', err)
      }
    }
}

async function setGreen() {
  console.log('Setting Green Role Now...')
  await getStuff()
  let redRole = await member.roles.cache.some(role => role.name === ('tickers-red'))
  console.log('redRole is:', redRole)
  let greenRole = await member.roles.cache.some(role => role.name === ('tickers-green'))
  console.log('greenRole is:', greenRole)
  if (redRole) {
    console.log ('redRole is true, so remove...')
    try {
      await (member.roles.remove(red))
      let redRole = await member.roles.cache.some(role => role.name === ('tickers-red'))
      console.log ('Attempted removal of redRole, if successful, this should be false:', redRole)
    } catch (err) {
      console.log('Unable to remove RED role', err)
      }
  }
  if (!greenRole) {
    console.log ('greenRole is false, so add...')
    try {
      await member.roles.add(green)
      let greenRole = await member.roles.cache.some(role => role.name === ('tickers-green'))
      console.log ('Attempted adding of greenRole, if successful, this should be true:', greenRole)
    } catch (err) {
      console.log('Unable to add GREEN role', err)
      }
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

    console.log('Initial price to', lastPrice)
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
        console.log('up')
        arrow = up
        setGreen()
        } else if (currentPrice < lastPrice) {
          console.log('down')
          arrow = down
          setRed()
        } else {
          console.log('same')
        }

        client.guilds.cache.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`${symbol.toUpperCase()} ${arrow} ${process.env.CURRENCY_SYMBOL}${currentPrice}`)
        console.log('Current price to', lastPrice)
        //console.log('priceChange 24h is', priceChange)

        lastPrice = currentPrice

    }
    else
      console.log('Could not load coin data for', process.env.COIN_ID)

  }).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
  console.log('Logged in as', client.user.tag)
  getInitialPrice() // Ping server once on startup
  // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
  setInterval(getPrices, Math.max(1, process.env.UPDATE_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
