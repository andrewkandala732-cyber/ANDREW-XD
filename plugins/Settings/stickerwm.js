import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        const fq = getFakeQuoted(m);
        const newStickerWM = args.join(" ") || null;  

        let settings = await getSettings();

        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Settings not found. Something's seriously broken.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
        }

        if (newStickerWM !== null) {
            if (newStickerWM === 'null') {
                if (!settings.packname) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Bot already has no sticker watermark, genius.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
                }
                await updateSetting('packname', '');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Sticker watermark removed. Happy now?\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
            } else {
                if (settings.packname === newStickerWM) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Watermark already set to: ${newStickerWM}\n├ Stop wasting my time.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
                }
                await updateSetting('packname', newStickerWM);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ STICKER WM ≪━━━\n├ \n├ Watermark updated to: ${newStickerWM}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
            }
        } else {
            await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ STICKER WM ≪━━━\n├ \n├ Current watermark: ${settings.packname || 'None set'}\n├ \n├ Use '${settings.prefix}stickerwm null' to remove\n├ Use '${settings.prefix}stickerwm <text>' to set\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
    });
};
