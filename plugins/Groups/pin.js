import middleware from '../../utils/botUtil/middleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'pin',
    aliases: ['pinmsg', 'unpin'],
    description: 'Pin or unpin a message in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, args } = context;
            const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply('╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━ᕗ PIN ᕙ━━━\n├ \n├ Quote a message to pin it,\n├ you absolute muppet.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆');
            }

            const isUnpin = (args[0] || '').toLowerCase() === 'unpin';

            const messageKey = {
                id: m.quoted.id,
                remoteJid: m.chat,
                participant: m.quoted.sender
            };

            try {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await client.pinMessage(m.chat, messageKey, isUnpin ? 0 : 1);
                await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━ᕗ ${isUnpin ? 'UNPINNED' : 'PINNED'} ᕙ━━━\n├ \n├ Message ${isUnpin ? 'unpinned' : 'pinned'} successfully.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                console.error('[PIN ERROR]', error?.message || error);
                const msg = error?.message || String(error);
                const isAuth = msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('403');
                if (isAuth) {
                    await m.reply('╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━ᕗ ERROR ᕙ━━━\n├ \n├ Failed to pin. Make sure I\'m admin.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆');
                } else {
                    await m.reply('╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━ᕗ ERROR ᕙ━━━\n├ \n├ Pin failed: ' + msg.slice(0, 80) + '\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆');
                }
            }
        });
    }
};
