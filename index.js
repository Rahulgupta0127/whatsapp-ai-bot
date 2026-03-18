const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('Scan QR below:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

client.on('message', async (message) => {
    const msg = message.body.toLowerCase();

    // FAQ replies
    if (msg.includes('price')) {
        return message.reply('Price starts from ₹999 😊');
    }

    if (msg.includes('booking')) {
        return message.reply('Please share date & number of guests 📅');
    }

    if (msg.includes('hi') || msg.includes('hello')) {
        return message.reply('Hey 😊 Welcome! How can I help you today?');
    }

    // AI reply
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message.body }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;

        setTimeout(() => {
            message.reply(reply);
        }, 2000);

    } catch (error) {
        message.reply("Thanks 😊 We'll reply shortly.");
    }
});

client.initialize();
