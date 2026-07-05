import { getFakeQuoted } from '../../lib/fakeQuoted.js';
export default async (context) => {
  const { client, m, text, botname } = context;
  const fq = getFakeQuoted(m);

  if (text) {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    return client.sendMessage(m.chat, { text: `╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ What's with the extra crap, @${m.sender.split('@')[0]}?\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝗔𝗡𝗗𝗥𝗘𝗪` });
  }

  try {
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      const daysDisplay = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '';
      const hoursDisplay = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : '';
      const minutesDisplay = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '';
      const secsDisplay = secs > 0 ? `${secs} ${secs === 1 ? 'second' : 'seconds'}` : '';

      return (daysDisplay + hoursDisplay + minutesDisplay + secsDisplay).replace(/,\s*$/, '');
    };

    const uptimeText = formatUptime(process.uptime());
    const replyText = `╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ Uᴘᴛɪᴍᴇ ≪━━━\n├ \n├ *${botname || '𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗'} Uptime, Bitches*\n├ \n├ I've been up for: ${uptimeText}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝗔𝗡𝗗𝗥𝗘𝗪`;

    await client.sendMessage(m.chat, { text: replyText }, { quoted: fq });
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error('Error in uptime command:', error);
    await client.sendMessage(m.chat, { text: `╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ Eʀʀᴏʀ ≪━━━\n├ \n├ Something's fucked up with the\n├ uptime command.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝗔𝗡𝗗𝗥𝗘𝗪` });
  }
};
