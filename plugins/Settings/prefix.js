import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, args } = context;
    const fq = getFakeQuoted(m);
    const newPrefix = args[0];

    const settings = await getSettings();

    if (newPrefix === 'null') {
      if (!settings.prefix) {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await m.reply(
          `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
          `├ Already prefixless, you clueless twit! 😈\n` +
          `├ Stop wasting my time! 🖕\n` +
          `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        );
      }
      await updateSetting('prefix', '');
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await m.reply(
        `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
        `├ Prefix obliterated! 🔥\n` +
        `├ I’m prefixless now, bow down! 😈\n` +
        `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
      );
    } else if (newPrefix) {
      if (settings.prefix === newPrefix) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return await m.reply(
          `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
          `├ Prefix is already ${newPrefix}, moron! 😈\n` +
          `├ Try something new, fool! 🥶\n` +
          `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
        );
      }
      await updateSetting('prefix', newPrefix);
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await m.reply(
        `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
        `├ New prefix set to ${newPrefix}! 🔥\n` +
        `├ Obey the new order, king! 😈\n` +
        `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
      );
    } else {
      await m.reply(
        `╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n` +
        `├ Current Prefix: ${settings.prefix || 'No prefix, peasant! 🥶'}\n` +
        `├ Use "${settings.prefix || '.'}prefix null" to go prefixless or "${settings.prefix || '.'}prefix <symbol>" to set one, noob!\n` +
        `╰━━━━━━━━━━━━━━━━ᕗ
> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`
      );
    }
  });
};