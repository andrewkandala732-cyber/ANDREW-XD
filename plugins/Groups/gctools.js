import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import middleware from '../../utils/botUtil/middleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

const H = (title) => `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ${title} ≪━━━\n├`;
const F = `╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
const box = (title, lines) => `${H(title)}\n${lines.map(l => `├ ${l}`).join('\n')}\n├\n${F}`;

async function sendSelectButtons(client, jid, fq, bodyText, title, rows) {
    try {
        const msg = generateWAMessageFromContent(jid, {
            interactiveMessage: {
                body: { text: bodyText },
                footer: { text: '' },
                nativeFlowMessage: {
                    buttons: [{
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({ title, sections: [{ title: 'Options', rows }] })
                    }]
                }
            }
        }, { quoted: fq });
        await client.relayMessage(jid, msg.message, { messageId: msg.key.id });
    } catch {
        await client.sendMessage(jid, { text: bodyText }, { quoted: fq });
    }
}

export default [

    {
        name: 'ngc',
        aliases: ['newgc', 'groupcreate', 'creategc', 'newgroup', 'creategroup'],
        description: 'Create a new WhatsApp group',
        run: async (context) => {
            const { client, m, text, isOwner, isSudo } = context;
            const fq = getFakeQuoted(m);
            if (!isOwner && !isSudo) {
                return client.sendMessage(m.chat, { text: box('ERROR', ['❌ Owner only command.']) }, { quoted: fq });
            }
            const name = text?.trim();
            if (!name) {
                return client.sendMessage(m.chat, {
                    text: box('USAGE', [
                        '📋 .ngc <group name>',
                        '📌 Tag members to add them',
                        '',
                        '  .ngc Fee Squad @user',
                        '  .newgc My Group',
                    ])
                }, { quoted: fq });
            }
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            try {
                const mentioned = m.mentionedJid?.filter(j => j !== client.user?.id) || [];
                const group = await client.groupCreate(name, mentioned);
                const gid = group?.id || group?.gid || '';
                let inviteLink = '';
                if (gid) {
                    try {
                        const code = await client.groupInviteCode(gid);
                        if (code) inviteLink = `https://chat.whatsapp.com/${code}`;
                    } catch {}
                }
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, {
                    text: box('GROUP CREATED', [
                        `✅ *Name:* ${name}`,
                        `👥 *Members added:* ${mentioned.length}`,
                        `🔗 *JID:* ${gid}`,
                        ...(inviteLink ? [`🔑 *Link:* ${inviteLink}`] : []),
                    ])
                }, { quoted: fq });
            } catch (e) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                await client.sendMessage(m.chat, { text: box('ERROR', [`❌ ${e.message}`]) }, { quoted: fq });
            }
        }
    },

    {
        name: 'ginfo',
        aliases: ['groupinfo', 'gcinfo', 'groupmeta', 'gmetadata', 'gcmeta'],
        description: 'Show group info and metadata',
        run: async (context) => {
            await middleware(context, async () => {
                const { client, m } = context;
                const fq = getFakeQuoted(m);
                if (!m.isGroup) {
                    return client.sendMessage(m.chat, { text: box('ERROR', ['❌ Use this inside a group.']) }, { quoted: fq });
                }
                await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                try {
                    const meta = await client.groupMetadata(m.chat);
                    const name    = meta?.subject || 'Unknown';
                    const desc    = meta?.desc || meta?.description || 'None';
                    const owner   = meta?.owner?.split('@')[0] || 'Unknown';
                    const created = meta?.creation
                        ? new Date(meta.creation * 1000).toLocaleDateString('en-GB')
                        : 'Unknown';
                    const members = meta?.participants?.length ?? 0;
                    const admins  = (meta?.participants || []).filter(p => p.admin).length;
                    const ephDur  = meta?.ephemeralDuration;
                    const eph     = ephDur
                        ? (ephDur === 86400 ? '24 hours' : ephDur === 604800 ? '7 days' : ephDur === 7776000 ? '90 days' : `${ephDur}s`)
                        : 'Off';
                    await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
                    await client.sendMessage(m.chat, {
                        text: box('GROUP INFO', [
                            `📛 *Name:* ${name}`,
                            `👑 *Owner:* +${owner}`,
                            `📅 *Created:* ${created}`,
                            `👥 *Members:* ${members}`,
                            `🛡️ *Admins:* ${admins}`,
                            `⏳ *Disappearing:* ${eph}`,
                            `📝 *Desc:* ${desc.slice(0, 80)}${desc.length > 80 ? '...' : ''}`,
                        ])
                    }, { quoted: fq });
                } catch (e) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    await client.sendMessage(m.chat, { text: box('ERROR', [`❌ ${e.message}`]) }, { quoted: fq });
                }
            });
        }
    },

    {
        name: 'wabot',
        aliases: ['addaibot', 'addwabot', 'gcaibot', 'addwhatsappbot'],
        description: 'Add the WhatsApp AI bot to this group',
        run: async (context) => {
            const { client, m, isOwner, isSudo } = context;
            const fq = getFakeQuoted(m);
            if (!isOwner && !isSudo) {
                return client.sendMessage(m.chat, { text: box('ERROR', ['❌ Owner only command.']) }, { quoted: fq });
            }
            if (!m.isGroup) {
                return client.sendMessage(m.chat, { text: box('ERROR', ['❌ Use this inside a group.']) }, { quoted: fq });
            }
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            try {
                await client.aiGroupAddBot(m.chat);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, {
                    text: box('AI BOT ADDED', ['✅ WhatsApp AI bot has been added to this group!'])
                }, { quoted: fq });
            } catch (e) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                await client.sendMessage(m.chat, { text: box('ERROR', [`❌ ${e.message}`]) }, { quoted: fq });
            }
        }
    },

    {
        name: 'disappearing',
        aliases: ['disappear', 'disap', 'dsp', 'gvanish', 'timer', 'ephemeral', 'vanish', 'gcvanish'],
        description: 'Set disappearing messages. No args = show picker.',
        run: async (context) => {
            await middleware(context, async () => {
                const { client, m, args, prefix } = context;
                const fq = getFakeQuoted(m);
                if (!m.isGroup) {
                    return client.sendMessage(m.chat, { text: box('ERROR', ['❌ Use this inside a group.']) }, { quoted: fq });
                }

                const MAP = {
                    'off': 0, '0': 0, 'no': 0, 'none': 0, 'disable': 0,
                    '24h': 86400, '24': 86400, '1d': 86400, 'day': 86400,
                    '7d': 604800, '7': 604800, 'week': 604800, '1w': 604800,
                    '90d': 7776000, '90': 7776000, '3m': 7776000, 'month': 7776000,
                };

                const arg = (args?.[0] || '').toLowerCase();

                if (!arg || !(arg in MAP)) {
                    const p = prefix || '.';
                    const bodyText = box('DISAPPEARING MESSAGES', [
                        '⏳ Pick a timer for this group:',
                        '',
                        `  🚫 off  — Disable`,
                        `  ⏰ 24h — 24 hours`,
                        `  📅 7d  — 7 days`,
                        `  🗓️ 90d — 90 days`,
                    ]);
                    const _dev = await getDeviceMode();
                    if (_dev === 'ios') {
                        return client.sendMessage(m.chat, { text: bodyText }, { quoted: fq });
                    }
                    return sendSelectButtons(
                        client, m.chat, fq,
                        bodyText,
                        'Set Timer',
                        [
                            { header: '🚫 Off',      title: 'Disable disappearing messages', id: `${p}disappearing off` },
                            { header: '⏰ 24 Hours', title: 'Messages vanish after 24h',      id: `${p}disappearing 24h` },
                            { header: '📅 7 Days',   title: 'Messages vanish after 7 days',   id: `${p}disappearing 7d`  },
                            { header: '🗓️ 90 Days',  title: 'Messages vanish after 90 days',  id: `${p}disappearing 90d` },
                        ]
                    );
                }

                const seconds = MAP[arg];
                const label   = seconds === 0 ? 'Off' : seconds === 86400 ? '24 hours' : seconds === 604800 ? '7 days' : '90 days';

                await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                try {
                    await client.groupToggleEphemeral(m.chat, seconds);
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    await client.sendMessage(m.chat, {
                        text: box('DISAPPEARING MESSAGES', [`⏳ *Set to:* ${label}`])
                    }, { quoted: fq });
                } catch (e) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    await client.sendMessage(m.chat, { text: box('ERROR', [`❌ ${e.message}`]) }, { quoted: fq });
                }
            });
        }
    },

];
