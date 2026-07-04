import fetch from 'node-fetch';
import { getFakeQuoted } from '../../lib/fakeQuoted.js';

export default {
    name: 'npm',
    aliases: ['npmsearch', 'npmjs'],
    description: 'Search for NPM packages',
    run: async (context) => {
        const { client, m, text } = context;
        const fq = getFakeQuoted(m);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const query = (text || '').trim();
            if (!query) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return m.reply("╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ Give me a package name, you useless human.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆");
            }

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const data = await response.json();

            const objects = data?.objects || [];
            if (objects.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                return m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├ No packages found for "${query}".\n├ Your search skills are as bad as your life choices.\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
            }

            let resultText = "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ NPM SEARCH ≪━━━\n├ \n";

            objects.forEach((obj, index) => {
                const pkg = obj.package;
                resultText += `├ ${index + 1}. ${pkg.name} v${pkg.version}\n`;
                if (pkg.description) resultText += `├   ${pkg.description.slice(0, 60)}\n`;
                resultText += `├   npmjs.com/package/${pkg.name}\n├ \n`;
            });

            if (data.total > 5) {
                resultText += `├ ...and ${data.total - 5} more results\n`;
            }

            resultText += "╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆";

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await m.reply(resultText);

        } catch (error) {
            console.error('NPM search error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await m.reply(`╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n├━━━≫ NPM ERROR ≪━━━\n├ \n├ NPM search failed. ${error.message}\n╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆`);
        }
    }
};
