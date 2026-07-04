import { getFakeQuoted } from '../../lib/fakeQuoted.js';
  import axios from 'axios';
export default async (context) => {
  const { client, m, text } = context;
  const fq = getFakeQuoted(m);
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    m.reply(
      "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
      "├ ERROR\n" +
      "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
      "│ 🚫 Please provide a search term!\n" +
      "├ Example: .google What is treason\n" +
      "╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆"
    );
    return;
  }

  try {
    let { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`
    );

    if (data.items.length == 0) {
      m.reply(
        "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
        "├ ERROR\n" +
        "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
        "│ ❌ Unable to find any results\n" +
        "╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆"
      );
      return;
    }

    let tex = "";
    tex += "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n";
    tex += "├ GOOGLE SEARCH\n";
    tex += "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n";
    tex += "│ 🔍 Search Term: " + text + "\n";
    tex += "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n";

    for (let i = 0; i < data.items.length; i++) {
      tex += "├ Result " + (i + 1) + "\n";
      tex += "│ 🪧 Title: " + data.items[i].title + "\n";
      tex += "│ 📝 Description: " + data.items[i].snippet + "\n";
      tex += "│ 🌐 Link: " + data.items[i].link + "\n";
      tex += "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n";
    }

    m.reply(tex);
  } catch (e) {
    m.reply(
      "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
      "├ ERROR\n" +
      "╭━━━ᕙ    ᖴᗴᗴ-᙭ᗰᗪツ    ᕗ━━━\n" +
      "│ ❌ An error occurred: " + e.message + "\n" +
      "╰━━━━━━━━━━━━━━━━ᕗ\n> ©𝖕𝖔𝖜𝖊𝖗𝖊𝖉 𝖇𝖞 𝖋𝖗𝖊𝖉𝖎_𝖊𝖟𝖗𝖆"
    );
  }
};