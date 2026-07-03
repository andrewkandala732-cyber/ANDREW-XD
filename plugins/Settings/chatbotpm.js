import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';
import { getDeviceMode } from '../../lib/deviceMode.js';

export default {
  name: 'chatbotpm',
  aliases: ['chatbot', 'autoreply'],
  description: 'Toggle Auto AI replies — responds to all DMs and when mentioned or replied to in groups',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, args, prefix } = context;
      const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      const fmt = (title, lines) => {
        const body = (Array.isArray(lines) ? lines : [lines]).map(l => `├ ${l}`).join('\n');
        return `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ ${title} ≪━━━\n├\n${body}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
      };

      try {
        const settings = await getSettings();
        const value = (args[0] || '').toLowerCase();

        if (value === 'on' || value === 'off') {
          const newState = value === 'on';
          if (settings.autoai === newState) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return client.sendMessage(m.chat, { text: fmt('AUTO AI', `already ${value.toUpperCase()} 🙄 stop pressing buttons`) }, { quoted: fq });
          }
          await updateSetting('autoai', newState);
          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
          return client.sendMessage(m.chat, {
            text: fmt('AUTO AI', newState
              ? ['Status: ✅ ON', 'Replies to all DMs + @mentions in groups.', 'God help them 😒']
              : ['Status: ❌ OFF', 'Silent mode. Finally.'])
          }, { quoted: fq });
        }

        const isOn = settings.autoai === true || settings.autoai === 'true';

                const _devMode = await getDeviceMode();
        if (_devMode === 'ios') {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await client.sendMessage(m.chat, { text: fmt('AUTO AI', [`Status: ${isOn ? '✅ ON' : '❌ OFF'}`, 'DMs: replies to every message', 'Groups: replies when @mentioned or replied to']) }, { quoted: fq });
        } else {
    const _msg = generateWAMessageFromContent(
              m.chat,
              {
                interactiveMessage: {
                  body: { text: fmt('AUTO AI', [`Status: ${isOn ? '✅ ON' : '❌ OFF'}`, 'DMs: replies to every message', 'Groups: replies when @mentioned or replied to']) },
                  footer: { text: '' },
                  nativeFlowMessage: {
                    buttons: [{
                      name: 'single_select',
                      buttonParamsJson: JSON.stringify({
                        title: 'Choose an option',
                        sections: [{
                          rows: [
                            { title: 'ON ✅', id: `${prefix}chatbotpm on` },
                            { title: 'OFF ❌', id: `${prefix}chatbotpm off` }
                          ]
                        }]
                      })
                    }]
                  }
                }
              },
              { quoted: fq }
            );
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

            await client.relayMessage(m.chat, _msg.message, { messageId: _msg.key.id });
        }
      } catch {
        client.sendMessage(m.chat, { text: fmt('AUTO AI', 'something broke. try again.') }, { quoted: fq });
      }
    });
  }
};
