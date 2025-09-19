const fs = require("fs");
const path = require("path");

const slotItems = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🍍"];
const dataFile = path.join(__dirname, "slotData.json");

// ডাটা ফাইল না থাকলে তৈরি
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}

function readData() {
    return JSON.parse(fs.readFileSync(dataFile));
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports.config = {
    name: "slot",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭",
    description: "Play slot machine with bet & coins",
    commandCategory: "game",
    usages: "slot <amount>",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const data = readData();
    const userID = event.senderID;

    // নতুন হলে স্টার্ট কয়েন
    if (!data[userID]) {
        data[userID] = { coins: 1000 };
        writeData(data);
    }

    let bet = parseInt(args[0]);
    if (!bet || isNaN(bet) || bet <= 0) {
        return api.sendMessage(
            `⚠️ Please enter a valid bet amount.\n💰 Your balance: ${data[userID].coins} coins`,
            event.threadID,
            event.messageID
        );
    }

    if (bet > data[userID].coins) {
        return api.sendMessage(
            `❌ You don't have enough coins.\n💰 Your balance: ${data[userID].coins} coins`,
            event.threadID,
            event.messageID
        );
    }

    const slot1 = slotItems[Math.floor(Math.random() * slotItems.length)];
    const slot2 = slotItems[Math.floor(Math.random() * slotItems.length)];
    const slot3 = slotItems[Math.floor(Math.random() * slotItems.length)];

    const result = `${slot1} | ${slot2} | ${slot3}`;
    let msg = `🎰 SLOT MACHINE 🎰\n\n${result}\n\n`;

    if (slot1 === slot2 && slot2 === slot3) {
        let win = bet * 5;
        data[userID].coins += win;
        msg += `✨ JACKPOT! You won ${win} coins! ✨\n`;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        let win = bet * 2;
        data[userID].coins += win;
        msg += `👍 Nice! You won ${win} coins!\n`;
    } else {
        data[userID].coins -= bet;
        msg += `😢 You lost ${bet} coins.\n`;
    }

    msg += `💰 Current Balance: ${data[userID].coins} coins`;

    writeData(data);
    api.sendMessage(msg, event.threadID, event.messageID);
};