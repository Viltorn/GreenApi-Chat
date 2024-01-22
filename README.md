# Bloom chat
![Node CI](https://github.com/Viltorn/frontend-project-12/actions/workflows/nodejs.yml/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/a52d9496d05e2f99b7fe/maintainability)](https://codeclimate.com/github/Viltorn/GreenApi-Chat/maintainability)

App made for small businesses and allows you to messaging via whatsApp api from any device without revealing contacts phone numbers.

## How to use:
  1. You need to register your whatsapp number using service [GreenApi](https://console.green-api.com). All messages sent via app will be associated with registered number.
  2. Go to app and login using your IdInstance and ApiTokenInstance from GreenApi service => [Bloom chat](https://green-api-chat-topaz.vercel.app)

## Current features:
  1. After log in app loads all chats from whatsApp associated with logged phone number
  2. Sending and receiving text and audio messages (chats with unread messages have special mark)
  3. Adding new chats (checks whatsapp availability for adding number) and renaming existing ones

Other features in development...
### Installation Guide:

* ```$ git clone: https://github.com/Viltorn/GreenApi-Chat.git```
* ```go to chat folder inside project directory```
* ```$ make install```
* ```$ make start```
