import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';

export default async (context) => {
    const { client, m, groupMetadata, text } = context;
    const fq = getFakeQuoted(m);
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.isGroup) return client.sendMessage(m.chat, { text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Command meant for groups.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆` }, { quoted: fq });

    const resolveParticipantJid = (p, participants) => {
        if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
        const base = p.jid || p.id || '';
        if (base && !base.endsWith('@lid')) return base.split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        return resolveTargetJid(base, participants);
    };

    try {
        const participants = groupMetadata?.participants || [];
        const mentions = participants.map(p => resolveParticipantJid(p, participants)).filter(Boolean);
        const txt = [
            `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━`,
            `├━━━≫ TAG ALL ≪━━━`,
            `├ `,
            `├ Message: ${text ? text : 'No Message!'}`,
            `├ `,
            ...mentions.map(id => `├ @${id.split('@')[0]}`),
            `╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        ].join('\n');
        await client.sendMessage(m.chat, { text: txt, mentions }, { quoted: fq });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Failed to tag participants.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆` }, { quoted: fq });
    }
};
