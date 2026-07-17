import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '🔄', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await m.reply(`╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ RESTART ≪━━━\n├ \n├ Restarting  𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗...\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝗔𝗡𝗗𝗥𝗘𝗪`);
        setTimeout(() => { process.exit(0); }, 3000);
    });
};
