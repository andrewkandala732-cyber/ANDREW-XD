import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import yts from 'yt-search';
export default async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const formatStylishReply = (message) => {
    return `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ ${message}\n╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`;
  };

  if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(formatStylishReply("Yo, dumbass, give me a song name! 🎵 Don’t waste my time."));
  }

  if (text.length > 100) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(formatStylishReply("What’s this essay, loser? Keep the song name short, max 100 chars."));
  }

  const { videos } = await yts(text);
  if (!videos || videos.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(formatStylishReply("No songs found, you got shit taste. 😕 Try something else."));
  }

  const song = videos[0];
  const title = song.title;
  const artist = song.author?.name || "Unknown Artist";
  const views = song.views?.toLocaleString() || "Unknown";
  const duration = song.duration?.toString() || "Unknown";
  const uploaded = song.ago || "Unknown";
  const thumbnail = song.thumbnail || "";
  const videoUrl = song.url;

  const response = `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
                  `├ *${title}* found for @${m.sender.split('@')[0].split(':')[0]}! 🎶\n` +
                  `│🎤 *Artist*: ${artist}\n` +
                  `│👀 *Views*: ${views}\n` +
                  `│⏱ *Duration*: ${duration}\n` +
                  `│📅 *Uploaded*: ${uploaded}\n` +
                  (thumbnail ? `│🖼 *Thumbnail*: ${thumbnail}\n` : '') +
                  `│🔗 *Video*: ${videoUrl}\n` +
                  `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆\n` +
                  `🔥🔥`;

  await m.reply(formatStylishReply(response));
};