import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    return client.sendMessage(m.chat, {
      text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Tell me a song name you dumbass!\n├ Example: .lyrics Alone ft ava max\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆'
    }, { quoted: fq });
  }

  try {
    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://api.deline.web.id/tools/lyrics?title=${encodedText}`;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result || data.result.length === 0) {
      return client.sendMessage(m.chat, {
        text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ No lyrics found for "${text}". Maybe the song sucks.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
      }, { quoted: fq });
    }

    const song = data.result[0];
    if (!song.plainLyrics) {
      return client.sendMessage(m.chat, {
        text: '╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ No plain lyrics for this one. Try another song, loser.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆'
      }, { quoted: fq });
    }

    const cleanLyrics = song.plainLyrics;
    const songTitle = song.trackName || song.name || 'Unknown';
    const artistName = song.artistName || 'Unknown Artist';
    const bodyText = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ LYRICS ≪━━━\n├ \n├ ${songTitle} - ${artistName}\n├ \n${cleanLyrics}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
    const copyCode = `${songTitle} - ${artistName}\n\n${cleanLyrics}`.slice(0, 4096);

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
                    display_text: '📋 Copy Lyrics',
                    copy_code: copyCode
                  })
                }
              ]
            }
          }
        },
        { quoted: fq }
      );
      await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch {
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await client.sendMessage(m.chat, { text: bodyText }, { quoted: fq });
    }
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    await client.sendMessage(m.chat, {
      text: `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ LYRICS ERROR ≪━━━\n├ \n├ Can't get lyrics for "${text}". Shit broke.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
    }, { quoted: fq });
  }
};
