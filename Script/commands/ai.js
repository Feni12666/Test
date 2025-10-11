module.exports.config = {
    name: "ai",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Ullash",
    description: "AI command using  DeepSeek API",
    commandCategory: "ai",
    usages: "[ask]",
    cooldowns: 2,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const { threadID, messageID } = event;
    const content = args.join(" ");
    if (!content) return api.sendMessage("Please type a message...", threadID, messageID);

    const encodedApi = "aHR0cHM6Ly9hcGlzLWtlaXRoLnZlcmNlbC5hcHAvYWkvZGVlcHNlZWtWMz9xPQ==";
    const apiUrl = Buffer.from(encodedApi, "base64").toString("utf-8");

    const loadingTexts = [
        "𝙰𝚒 𝙸𝚜 𝚆𝚘𝚛𝚔𝚒𝚗𝚐...☢️",
        "𝙰𝚒 𝙸𝚜 𝚆𝚘𝚛𝚔𝚒𝚗𝚐...⚠️",
        "𝙰𝚒 𝙸𝚜 𝚆𝚘𝚛𝚔𝚒𝚗𝚐...☣️"
    ];

    let index = 0;
    const loadingMessage = await api.sendMessage(loadingTexts[index], threadID);

    const interval = setInterval(() => {
        index = (index + 1) % loadingTexts.length;
        api.editMessage(loadingTexts[index], threadID, loadingMessage.messageID);
    }, 1200);

    try {
        const res = await axios.get(`${apiUrl}${encodeURIComponent(content)}`);
        const respond = res.data.result || res.data.response || res.data.message || "No response from AI.";

        clearInterval(interval);
        api.unsendMessage(loadingMessage.messageID);
        api.sendMessage(respond, threadID, messageID);
    } catch (error) {
        clearInterval(interval);
        api.unsendMessage(loadingMessage.messageID);
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", threadID, messageID);
    }
};