import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, getGroupSettings, updateGroupSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    const value = args[0]?.toLowerCase();
    const jid = m.chat;

    const formatStylishReply = (title, message) => {
      return `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ${title} ≪━━━\n├ \n├ ${message}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
    };

    if (!jid.endsWith('@g.us')) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", "Nice try, idiot!\n├ This command is for groups only, you moron!") }, { quoted: fq });
    }

    const settings = await getSettings();
    const prefix = settings.prefix;

    let groupSettings = await getGroupSettings(jid);
    let isEnabled = groupSettings?.antipromote === true;

    if (value === 'on' || value === 'off') {
      const action = value === 'on';

      if (isEnabled === action) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", `Antipromote is already ${value.toUpperCase()}, you clueless moron!\n├ Stop spamming my commands!\n├ \n├ 📌 Usage: ${prefix}antipromote on | ${prefix}antipromote off`) }, { quoted: fq });
      }

      await updateGroupSetting(jid, 'antipromote', action);
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      return await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", `Antipromote ${value.toUpperCase()}!\n├ Promotions are under my control, king!\n├ \n├ 📌 Usage: ${prefix}antipromote on | ${prefix}antipromote off`) }, { quoted: fq });
    }

        const _devMode = await getDeviceMode();
    if (_devMode === 'ios') {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await client.sendMessage(m.chat, { text: formatStylishReply("ANTIPROMOTE", `Antipromote's ${isEnabled ? 'ON' : 'OFF'} right now. Pick one, fool!\n├ \n├ 📌 Usage: ${prefix}antipromote on | ${prefix}antipromote off`) }, { quoted: fq });
    } else {
    const _msg = generateWAMessageFromContent(
            m.chat,
            {
                interactiveMessage: {
                    body: { text: formatStylishReply("ANTIPROMOTE", `Antipromote's ${isEnabled ? 'ON' : 'OFF'} right now. Pick one, fool!\n├ \n├ 📌 Usage: ${prefix}antipromote on | ${prefix}antipromote off`) },
                    footer: { text: '' },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: 'Choose an option',
                                    sections: [{
                                        rows: [
                                                                                                    { title: 'ON ✅', id: `${prefix}antipromote on` },
                                                            { title: 'OFF ❌', id: `${prefix}antipromote off` }
                                        ]
                                    }]
                                })
                            }
                        ]
                    }
                }
            },
            { quoted: fq }
          );
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

          await client.relayMessage(m.chat, _msg.message, { messageId: _msg.key.id });
    }
  });
};
