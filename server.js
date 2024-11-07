require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const router = require("./src/modules");
const localText = require('./text.json')
const {
   bot
} = require('./src/lib/bot')
const model = require('./model')

bot.onText(/\/start/, async (msg) => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      bot.sendMessage(chatId, localText?.mainText, {
         reply_markup: {
            keyboard: [
               [{
                  text: localText.mainBtn1
               }],
               [{
                  text: localText.mainBtn2
               }],
               [{
                  text: localText.mainBtn3
               }],
               [{
                  text: localText.mainBtn4
               }],
            ],
            resize_keyboard: true
         }
      })
   } else {
      bot.sendMessage(chatId, localText?.startTextFromBot, {
         reply_markup: {
            keyboard: [
               [{
                  text: localText.sendContact,
                  request_contact: true,
                  one_time_keyboard: true
               }],
            ],
            resize_keyboard: true
         }
      })
   }
})

bot.on('contact', async (msg) => {
   const chatId = msg.chat.id;

   if (msg.contact) {
      let phoneNumber = msg.contact.phone_number;

      if (msg.contact.user_id !== msg.from.id) {
         return bot.sendMessage(chatId, localText.contactErrorText, {
            reply_markup: {
               keyboard: [
                  [{
                     text: sendContact,
                     request_contact: true
                  }]
               ],
               resize_keyboard: true,
               one_time_keyboard: true
            }
         })
      }

      if (!phoneNumber.startsWith('+')) {
         phoneNumber = `+${phoneNumber}`;
      }

      const addPhoneUser = await model.addUser(chatId, phoneNumber)

      if (addPhoneUser) {
         bot.sendMessage(chatId, localText.successContact, {
            reply_markup: {
               keyboard: [
                  [{
                     text: localText.mainBtn1
                  }],
                  [{
                     text: localText.mainBtn2
                  }],
                  [{
                     text: localText.mainBtn3
                  }],
                  [{
                     text: localText.mainBtn4
                  }],
               ],
               resize_keyboard: true
            }
         })
      }
   }
})

bot.on('message', async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;

   if (text == localText?.mainBtn1) {
      bot.sendMessage(chatId, localText.mainBtn1Response)
   } else if (text == localText.mainBtn2) {
      bot.sendMessage(chatId, localText.mainBtn2Response)
   } else if (text == localText.mainBtn3) {
      bot.sendMessage(chatId, localText.mainBtn3Response)
   } else if (text == localText.mainBtn4) {
      bot.sendMessage(chatId, localText.mainBtn4Response)
   }
})

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use("/api/v1", router);

app.listen(5000, console.log(5000))