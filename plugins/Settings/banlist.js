import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getBannedUsers } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        const fq = getFakeQuoted(m);

        const bannedUsers = await getBannedUsers();

        if (!bannedUsers || bannedUsers.length === 0) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply(
                `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
                `├━━━≫ BAN LIST ≪━━━\n` +
                `├ \n` +
                `├ There are no banned users at the moment.\n` +
                `╰━━━━━━━━━━━━━━━━ᕗ\n` +
                `> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            );
        }

        const list = bannedUsers.map((num, index) => `├ ${index + 1}. ${num}`).join('\n');
        await m.reply(
            `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
            `├━━━≫ BAN LIST ≪━━━\n` +
            `├ \n` +
            `${list}\n` +
            `╰━━━━━━━━━━━━━━━━ᕗ\n` +
            `> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        );
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    });
};
