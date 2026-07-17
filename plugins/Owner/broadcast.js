import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, participants, pushname } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├ \n├ Provide a broadcast message!\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 kandala `);
}
if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├ \n├ This command is meant for groups.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 kandala `);
}

let getGroups = await client.groupFetchAllParticipating() 
         let groups = Object.entries(getGroups) 
             .slice(0) 
             .map(entry => entry[1]) 
         let res = groups.map(v => v.id) 

await m.reply(`╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ BROADCAST ≪━━━\n├ \n├ Sending broadcast message...\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 kandala `)

for (let i of res) { 


let txt = `╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ BROADCAST ≪━━━\n├ \n├ Message: ${text}\n├ \n├ Written by: ${pushname}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 kandala ` 

await client.sendMessage(i, { 
                 image: { 
                     url: "https://raw.githubusercontent.com/Fred1e/FEE-XMD/main/media/fredi.jpg" 
                 }, mentions: participants.map(a => a.id),
                 caption: `${txt}` 
             }, { quoted: fq }) 
         } 
await m.reply(`╭━━━ᕙ     𝗔𝗡𝗗𝗥𝗘𝗪 𝗫𝗗ツ    ᕗ━━━\n├━━━≫ DONE ≪━━━\n├ \n├ Message sent across all groups.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 kandala `);
})

}
