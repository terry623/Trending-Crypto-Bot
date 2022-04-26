const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios").default;
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const rankApi = "https://api.coinmarketcap.com/data-api/v3/topsearch/rank";

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/rank/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const {
      data: { data },
    } = await axios.get(rankApi);

    const { cryptoTopSearchRanks } = data;

    const ranks = cryptoTopSearchRanks
      .map(
        (crypto, index) =>
          `(${index + 1}) ${crypto.symbol}：${crypto.priceChange.price.toFixed(
            2
          )}`
      )
      .join("\n");

    bot.sendMessage(chatId, ranks);
  } catch (error) {
    bot.sendMessage(chatId, "Something Wrong");
  }
});
