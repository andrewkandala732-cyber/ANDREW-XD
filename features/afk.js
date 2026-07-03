const afkMap = new Map();

export default async (client, m) => {
    if (!m || !m.sender) return;
    const senderNum = m.sender.split('@')[0].split(':')[0];

    if (afkMap.has(senderNum)) {
        const { reason, time } = afkMap.get(senderNum);
        const mins = Math.floor((Date.now() - time) / 60000);
        afkMap.delete(senderNum);
        try {
            await client.sendMessage(m.chat, {
                text: `╭━━━ᕙ    『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠』    ᕗ━━━\n├━━━≫ BACK ONLINE ≪━━━\n├ @${senderNum} finally crawled back.\n├ Was AFK for ${mins} min${mins !== 1 ? 's' : ''}.\n╰━━━━━━━━━━━━━━━━ᕗ\n『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠』`,
                mentions: [m.sender]
            });
        } catch {}
        return;
    }

    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
                     m.message?.imageMessage?.contextInfo?.mentionedJid ||
                     m.message?.videoMessage?.contextInfo?.mentionedJid || [];
    for (const jid of mentions) {
        const num = jid.split('@')[0].split(':')[0];
        if (afkMap.has(num)) {
            const { reason, time } = afkMap.get(num);
            const mins = Math.floor((Date.now() - time) / 60000);
            try {
                await client.sendMessage(m.chat, {
                    text: `╭━━━ᕙ    『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠    ᕗ━━━\n├━━━≫ AFK ALERT ≪━━━\n├ @${num} is currently ghosting everyone.\n├ Reason: ${reason || 'none given 💀'}\n├ Since: ${mins} min${mins !== 1 ? 's' : ''} ago\n╰━━━━━━━━━━━━━━━━ᕗ\n『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠』`,
                    mentions: [jid, m.sender]
                });
            } catch {}
        }
    }
};

export const setAfk = (num, reason) => afkMap.set(num, { reason, time: Date.now() });
export const removeAfk = (num) => afkMap.delete(num);
export const isAfk = (num) => afkMap.has(num);