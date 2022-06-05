import {
    Bot,
    Context,
    InlineKeyboard,
    Keyboard,
    session,
    SessionFlavor,
} from 'grammy'
import * as dotenv from 'dotenv'
import { randomInt } from 'crypto'

dotenv.config()
type MyContext = Context & SessionFlavor<SessionData>

interface SessionData {}

// Create a bot object
const bot = new Bot<MyContext>(process.env.BOT_API!, {
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
}) // <-- place your bot token in this string

// Install session middleware, and define the initial session value.
function initial(): SessionData {
    return {
        item: { name: 'manos', damage: 1, damageType: 0 },
        points: 0,
        heroName: 'Don nadie',
        language: 0, //ES by default
        wallet: '',
        privateKey: '',
    }
}

bot.use(session({ initial }))

bot.command('start', async ctx => {})

// Start the bot (using long polling)
bot.start()
