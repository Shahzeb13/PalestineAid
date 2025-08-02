const express = require("express");
const { handleChat } = require("../controllers/chatbotController");
const chatbotRouter = express.Router();

chatbotRouter.post('/chatwithme', handleChat);

module.exports = chatbotRouter;