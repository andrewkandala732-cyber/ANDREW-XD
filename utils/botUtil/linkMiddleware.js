export default async (context, next) => {
    const { m, isBotAdmin } = context;

    if (!m.isGroup) {
        return m.reply(`╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗    ᕗ━━━\n├━━━≫ Gʀᴏᴜᴘ Oɴʟʏ ≪───\n├ \n├ This command only works in groups!\n├ Private chat? For this? Pathetic.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠』`);
    }

    if (!isBotAdmin) {
        return m.reply(`╭━━━ᕙ    𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗    ᕗ━━━\n├━━━≫ Aᴅᴍɪɴ Rᴇϙᴜɪʀᴇᴅ ≪━━━\n├ \n├ I need admin rights to get the group link!\n├ Make me admin or watch me do nothing.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©『☠』 𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗 『☠』`);
    }

    await next();
};