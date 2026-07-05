import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import linkMiddleware from '../../utils/botUtil/linkMiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  await linkMiddleware(context, async () => {
    const { client, m } = context;
    const fq = getFakeQuoted(m);

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    try {
      const code = await client.groupInviteCode(m.chat);
      const link = `https://chat.whatsapp.com/${code}`;

      const bodyText =
        `╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n` +
        `├━━━≫ Gʀᴏᴜᴘ Lɪɴᴋ ≪━━━\n` +
        `├ \n` +
        `├ ${link}\n` +
        `├ \n` +
        `├ Here's your precious link.\n` +
        `├ Copy it and stop bugging me.\n` +
        `╰━━━━━━━━━━━━━━━━ᕗ\n` +
        `> ©𝗔��𝗗𝗥𝗘𝗪`;

      try {
        const msg = generateWAMessageFromContent(
          m.chat,
          {
            interactiveMessage: {
              body: { text: bodyText },
              footer: { text: '' },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                      display_text: 'Copy Link',
                      copy_code: link
                    })
                  }
                ]
              }
            }
          },
          { quoted: fq }
        );
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
      } catch {
        await m.reply(bodyText);
      }

      await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
    } catch {
      await client.sendMessage(m.chat, { react: { text: '', key: m.reactKey } });
      await m.reply(`╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Couldn't fetch the link.\n├ Either make me admin or quit.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝗔𝗡𝗗𝗥𝗘𝗪`);
    }
  });
};
