import { Bot, InlineKeyboard, session, } from 'grammy';
import * as dotenv from 'dotenv';
dotenv.config();
// Create a bot object
const bot = new Bot(process.env.BOT_API, {
    //access https://api.telegram.org/bot your api key /getMe
    botInfo: {
        id: 5311703858,
        is_bot: true,
        first_name: 'MatchainBot',
        username: 'MatchainBot',
        can_join_groups: true,
        can_read_all_group_messages: false,
        supports_inline_queries: false,
    },
}); // <-- place your bot token in this string
// Create a keyboard for the webapp
const keyboard = new InlineKeyboard()
    .webApp('Matchain Home', 'https://astronaut-penguin-test.netlify.app/')
    .row()
    .url('I wanna learn!', 'https://github.com/Astronaut-Penguin/Matchain-Showroom-Template')
    .row()
    .url('Lets Play!', 'https://github.com/Astronaut-Penguin/Matchain-TONCore');
// Install session middleware, and define the initial session value.
function initial() {
    return {
        language: 0, //ES by default
    };
}
bot.use(session({ initial }));
bot.command('start', async (ctx) => {
    await ctx.reply('Welcome to Matchain! this bot its made for you to play, learn to develop or to know more about us with less clicks!', {
        reply_markup: keyboard,
    });
});
// Start the bot (using long polling)
bot.start();
