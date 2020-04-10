#!/bin/sh

npm update

npm install --production

# TODO: add BOT_TOKEN

node main.js

echo "Telegram bot started..."
