import { makeSong } from '../../lib/frediApi.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getSettings } from '../../database/config.js';

export default {
    name: 'aisong',
    aliases: ['gensong', 'songgenerator'],
    description: 'Generate a song using AI',
    category: 'Search',
    run: async (context) => {
        const { client, m } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const settings = await getSettings();
        const prefix = settings.prefix || '.';

        const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

        if (!prompt) {
            return client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Eʀʀoʀ ≪━━━\n├ \n├ Give me something to work with.\n├ Example: ${prefix}aisong a sad love song about rain\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const result = await makeSong(prompt);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            const audioUrl = typeof result === 'string' ? result
                : (result?.audio || result?.url || result?.song || result?.output || '');

            if (audioUrl && audioUrl.startsWith('http')) {
                await client.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: 'song.mp3'
                }, { quoted: fq });
                await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ AI Sᴏɴɢ ≪━━━\n├ \n├ Prompt: ${prompt}\n├ Generated successfully.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            } else {
                const display = typeof result === 'string' ? result : JSON.stringify(result);
                await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ AI Sᴏɴɢ ≪━━━\n├ \n├ Prompt: ${prompt}\n├ \n├ ${display}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            }
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ Fᴀɪʟᴇᴅ ≪━━━\n├ \n├ Song generation failed. Try again.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }
    }
};