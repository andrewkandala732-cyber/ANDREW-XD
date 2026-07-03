import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.quoted) {
        return await client.sendMessage(m.chat, {
            text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ RETRIEVE ≪━━━\n├ \n├ Reply to a view-once message, genius. 🙄\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        }, { quoted: fq });
    }

    try {
        let dest = client.user?.id || '';
        if (dest.includes(':')) dest = dest.split(':')[0] + '@s.whatsapp.net';
        if (!dest) dest = client.decodeJid ? client.decodeJid(client.user.id) : client.user.id;
        const mediaType = m.quoted?.mtype || '';
        const isImage = mediaType === 'imageMessage' || !!(m.quoted?.imageMessage);
        const isVideo = mediaType === 'videoMessage' || !!(m.quoted?.videoMessage);
        const isAudio = mediaType === 'audioMessage' || !!(m.quoted?.audioMessage);

        if (isImage || isVideo || isAudio) {
            const buffer = await m.quoted.download();
            if (!buffer || buffer.length === 0) {
                return await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ RETRIEVE ≪━━━\n├ \n├ Couldn't download it. WhatsApp already nuked it. 😤\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
                }, { quoted: fq });
            }
            const senderNum = (m.quoted?.sender || '').split('@')[0].split(':')[0] || 'Unknown';
            const caption = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ VIEW ONCE RETRIEVED ≪━━━\n├ \n├ 👁 Sender: @${senderNum}\n├ 📍 Chat: ${m.isGroup ? 'Group' : 'DM'}\n├ \n├ You sneaky little thing. 😈\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
            const mentions = m.quoted?.sender ? [m.quoted.sender] : [];
            if (isImage) {
                await client.sendMessage(dest, { image: buffer, caption, mentions });
            } else if (isVideo) {
                await client.sendMessage(dest, { video: buffer, caption, mentions });
            } else {
                const mime = m.quoted?.audioMessage?.mimetype || 'audio/ogg; codecs=opus';
                const isPtt = m.quoted?.audioMessage?.ptt !== false;
                await client.sendMessage(dest, { audio: buffer, ptt: isPtt, mimetype: mime });
                await client.sendMessage(dest, { text: caption, mentions });
            }
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return;
        }

        const ctx = m.msg?.contextInfo || m.message?.extendedTextMessage?.contextInfo || {};
        const quotedMsg = ctx.quotedMessage || {};

        const unwrap = (msg) => {
            if (!msg) return null;
            const voKeys = ['viewOnceMessageV2Extension', 'viewOnceMessageV2', 'viewOnceMessage'];
            for (const k of voKeys) {
                if (msg[k]?.message) return msg[k].message;
            }
            return msg;
        };

        const inner = unwrap(quotedMsg);
        const imageMsg = inner?.imageMessage || null;
        const videoMsg = inner?.videoMessage || null;
        const audioMsg = inner?.audioMessage || null;

        if (!imageMsg && !videoMsg && !audioMsg) {
            return await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ RETRIEVE ≪━━━\n├ \n├ That's not a view-once. Stop wasting my time. 😒\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }

        const mediaMsg = imageMsg || videoMsg || audioMsg;
        const buffer = await client.downloadMediaMessage(mediaMsg);

        if (!buffer || buffer.length === 0) {
            return await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ RETRIEVE ≪━━━\n├ \n├ Couldn't download it. WhatsApp already nuked it. 😤\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
            }, { quoted: fq });
        }

        const senderNum = (m.quoted?.sender || ctx.participant || '').split('@')[0].split(':')[0] || 'Unknown';
        const caption = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ VIEW ONCE RETRIEVED ≪━━━\n├ \n├ 👁 Sender: @${senderNum}\n├ 📍 Chat: ${m.isGroup ? 'Group' : 'DM'}\n├ \n├ You sneaky little thing. 😈\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
        const mentions = ctx.participant ? [ctx.participant] : [];

        if (imageMsg) {
            await client.sendMessage(dest, { image: buffer, caption, mentions });
        } else if (videoMsg) {
            await client.sendMessage(dest, { video: buffer, caption, mentions });
        } else {
            const mime = audioMsg.mimetype || 'audio/ogg; codecs=opus';
            const isPtt = audioMsg.ptt !== false;
            await client.sendMessage(dest, { audio: buffer, ptt: isPtt, mimetype: mime });
            await client.sendMessage(dest, { text: caption, mentions });
        }
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        await client.sendMessage(m.chat, {
            text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ RETRIEVE ≪━━━\n├ \n├ Something broke. WhatsApp's fault, not mine. 😤\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        }, { quoted: fq });
    }
};
