import { createKeyPair, createWallet } from './wallet'
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

/*
DamageTypes

0 FUE
1 DES
2 CON
3 PER
4 SAB
5 INT

*/

type item = {
    name: string
    damage: number
    damageType: number
}

type MyContext = Context & SessionFlavor<SessionData>

interface SessionData {
    item: item
    points: number
    heroName: string
    language: number
    wallet: any
    privateKey: any
}

const itemListES: item[] = [
    { name: 'Cuchara', damage: 1, damageType: 4 },
    { name: '9MM', damage: 1, damageType: 2 },
    { name: 'Pala', damage: 1, damageType: 0 },
    { name: 'Cuchillo', damage: 1, damageType: 0 },
    { name: 'AK47', damage: 1, damageType: 1 },
    { name: 'Minigun', damage: 99, damageType: 3 },
]

const enemyListES: string[] = [
    'Pollo Rabioso',
    'Todopoderoso carpincho',
    'Soldado completamente drogado',
    'Medico completamente desquisiado',
    'Un dios olvidado del viejo mundo',
    'Tu suegra!',
    'Tu scrum master',
    'Alguien que te pregunta "tenes hora ameo ?" ',
    'El sindicalista mas traspirado que viste jamas ',
    'El jefe adicto a las PATAS',
    'Alejo borracho',
    'German a punto de rendir un final',
]

const itemDamage: string[] = ['FUE', 'DES', 'CON', 'PER', 'SAB', 'INT']

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

const keyboardES = new Keyboard().text('Pelear')

const inlineKeyboard = new InlineKeyboard().text(
    'Clickee aqui, para inicializar wallet',
    'CWallet'
)

bot.command('start', async ctx => {
    await ctx.reply('Detectando wallet', { reply_markup: inlineKeyboard })

    await ctx.reply('Seleccionando teclado custom para la experiencia', {
        reply_markup: {
            resize_keyboard: true,
            keyboard: keyboardES.build(),
        },
    })
})

// Wait for click events with specific callback data. on inline keyboards
bot.callbackQuery('CWallet', async ctx => {
    await ctx.answerCallbackQuery({
        text: 'Creando wallet',
    })

    const pair = await createKeyPair()
    const walletInfo = await createWallet(pair.keypair)

    await ctx.reply(
        `Tu clave privada es: ${walletInfo.SecretKey} guardala bien`
    )

    await ctx.reply(
        `Tu address es: ${walletInfo.Address.toString(true, true, true)}`
    )

    if (walletInfo.Balance == '0') {
        await ctx.reply(
            `Tu balance actual es nulo, para pagar por cualquier cosa en nuestra plataforma fondee la cuenta`
        )
        await ctx.reply(
            `Si nunca enviaste dinero a tu wallet hazlo, de lo contrario nunca estará inicializada`
        )
    }

    ctx.session.privateKey = pair.keypair.secretKey
    ctx.session.wallet = walletInfo
})

bot.hears('Pelear', async ctx => {
    if (!ctx.session.wallet) {
        ctx.reply('Por favor primero clickea para crear la wallet')
        return
    }
    //to check if user press fight custom keyboard button or if he/she chooses to write it
    const enemy = enemyListES[await randomInt(0, enemyListES.length)]!
    await ctx.reply(`Peleas contra ${enemy}`)
    const weapon = itemListES[await randomInt(0, itemListES.length)]!
    await ctx.reply(
        `Que agarra ${weapon.name}, que tiene ${
            weapon.damage
        } de tipo de daño de ${itemDamage[weapon.damageType]}`
    )

    ctx.session.item = itemListES[await randomInt(0, itemListES.length)]!
    await ctx.reply(
        `Tu unica opcion es agarrar la/el ${ctx.session.item.name}, que tiene ${
            ctx.session.item.damage
        } de tipo de daño de ${
            itemDamage[ctx.session.item.damageType]
        } que se encuentra en el barro`
    )

    const result = await randomInt(0, 3)!

    switch (result) {
        case 0: {
            await ctx.reply(
                'Ambos luchan a muerte con ellos, en los últimos momentos de la batalla se atacan mutuamente con la última pizca de energía, y mueres'
            )
            break
        }
        case 1: {
            await ctx.reply(
                'Ambos luchan a muerte con ellos, pero ganas de forma brutal, ya no eres la misma persona.'
            )
            break
        }
        case 2: {
            await ctx.reply(
                'Ambos luchan a muerte con ellos, pero ambos resbalan por el barro, golpeandose mutuamente, muriendo de forma ridicula.... patetico.'
            )
            break
        }
        default: {
        }
    }
})

// Start the bot (using long polling)
bot.start()
