import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

const DEV_NUMBER = '255752593977';

export default {
    name: 'frediai',
    aliases: ['devai', 'frediagent'],
    description: 'Toggle FrediAgent GitHub AI (dev only)',
    run: async (context) => {
        const { client, m, args, prefix } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const senderNum = (m.sender || '').split('@')[0].split(':')[0];
        const fmt = (title, lines) => {
            const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
            return `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ${title} ≪━━━\n├\n${body}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
        };

        if (senderNum !== DEV_NUMBER) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: fmt('FREDIAGENT', ['Access denied.', 'Dev-only feature. Not your toy.'])
            }, { quoted: fq });
        }

        try {
            const settings = await getSettings();
            const value = (args[0] || '').toLowerCase();

            if (value === 'on' || value === 'off') {
                const newState = value === 'on';
                await updateSetting('toxicagent', newState);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: fmt('FREDIAGENT', newState
                        ? ['Status: ✅ ON', 'GitHub AI agent active. Just text me GitHub tasks.']
                        : ['Status: ❌ OFF', 'GitHub AI disabled.'])
                }, { quoted: fq });
            }

            const isOn = settings.toxicagent === true || settings.toxicagent === 'true';

                        const _devMode = await getDeviceMode();
            if (_devMode === 'ios') {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await client.sendMessage(m.chat, { text: fmt('FREDIAGENT', [
                            `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
                            'Handles: create/delete/rename repos, upload files,',
                            '         list branches, create issues, star repos',
                            '',
                            'Say "clear conversation" to reset memory'
                        ]) }, { quoted: fq });
            } else {
    const _msg = generateWAMessageFromContent(m.chat, {
                    interactiveMessage: {
                        body: {
                            text: fmt('FREDIAGENT', [
                                `Status: ${isOn ? '✅ ON' : '❌ OFF'}`,
                                'Handles: create/delete/rename repos, upload files,',
                                '         list branches, create issues, star repos',
                                '',
                                'Say "clear conversation" to reset memory'
                            ])
                        },
                        footer: { text: '' },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'Toggle FrediAgent',
                                    sections: [{
                                        rows: [
                                            { title: 'ON ✅', description: 'Enable GitHub AI agent', id: `${prefix}frediai on` },
                                            { title: 'OFF ❌', description: 'Disable GitHub AI agent', id: `${prefix}toxicai off` }
                                        ]
                                    }]
                                })
                            }]
                        }
                    }
                }, { userJid: client.user.id });
                if (_msg?.key?.id) {
                    await client.relayMessage(m.chat, _msg.message, { messageId: _msg.key.id });
                }
            }
        } catch {
            client.sendMessage(m.chat, { text: fmt('FREDIAGENT', 'something broke. try again.') }, { quoted: fq });
        }
    }
};
