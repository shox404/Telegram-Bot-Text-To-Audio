const { Telegraf } = require("telegraf");
const fs = require("fs");
const GTTS = require("gtts");

const { bot_token } = JSON.parse(fs.readFileSync(`./config.json`));

const bot = new Telegraf(bot_token);

let language = "";

bot.command("start", (ctx) => {
	ctx.reply("Выберите язык", {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "Английский", callback_data: "en" },
					{ text: "Русский", callback_data: "ru" }
				]
			]
		}
	})
	ctx.reply("Вам конвертировать текст на аудио ?", {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "Конверировать", callback_data: "convert" },
				]
			]
		}
	});
});

bot.action('convert', (ctx) => {
	return ctx.reply("Напишите текст")
})

bot.on("text", (ctx) => {
	const gtts = new GTTS(ctx.update.message.text, language);
	gtts.save('audio.mp3');

	ctx.reply("Конвертировать", {
		reply_markup: {
			inline_keyboard: [
				[
					{ text: "👍", callback_data: "key" },
					{ text: "👎", callback_data: "key" }
				]
			]
		}
	})
})

bot.action("key", (ctx) => {
	ctx.replyWithAudio({ source: "./audio.mp3" })
})

bot.action("en", () => language = "en")
bot.action("ru", () => language = "ru")

bot.launch({
	dropPendingUpdates: true,
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));