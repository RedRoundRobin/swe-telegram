#!/bin/sh

if [ ! -d "node_modules/" ]; then

	npm install --production

fi

node main.js

echo "Telegram bot started..."
