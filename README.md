# Cryptocurrency Price Status Discord Bot

This bot will update its status message:
1. With the current price
2. Changing colors to denote an increase or decrease from last check, if any
3. Changing arrow direction to denote and increase or decrease from last check, if any

It is based on [Cryptocurrency-Status-Discord-Bot](https://github.com/cferreras-zz/Cryptocurrency-Status-Discord-Bot) by Carlos Ferreras

who based it on [Minecraft Player Count Discord Bot](https://github.com/SpencerTorres/Minecraft-Player-Count-Discord-Bot) by Spencer Torres

It takes inspiration for how it works and looks from [discord-stock-ticker](https://github.com/rssnyder/discord-stock-ticker) by Riley Snyder

![Example bot setup.](https://images2.imgbox.com/79/b2/iVPxlKO4_o.jpg)

## How to use

This bot is really easy to use

Just follow these steps:
1. Have [Node.JS](https://nodejs.org) installed.
2. Clone this repository to a folder on your computer.
3. Open a terminal in that folder, and install the packages with `npm install`
4. Open the `.env-template` file and configure it to your liking, saving as `.env`

For information on getting a bot token, follow the steps on [the Discord developer documentation.](https://discordapp.com/developers/docs/intro)

Note: this code has been updated to work with discord.js v13 and you will have to give you bot the priviledged gateway intents (Presence and Server Members)

## Extra Info

This relies on the free API hosted at https://api.coingecko.com

I am not a Javascript developer (I'm not a real developer at all actually, I just bang on my keyboard until something mostly works).  This code is very
crude and inelegant but worked for me.  I'm sure it can be made much more efficient and I might circle back to it at some point.
