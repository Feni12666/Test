const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "zisan",
    version: "1.2.2",
    hasPermssion: 2,            // কেবলমাত্র চেকের জন্য, মূল কন্ট্রোল নিচে
    credits: "Md Shahadat Hosen",
    description: "Send a random photo without repeating until all are sent",
    commandCategory: "image",
    usages: "uniquephoto",
};

// শুধু এই আইডিগুলো কমান্ড চালাতে পারবে
const allowedAdmins = [
    "100048230798762",
    "100001088468923",
    "61572299956804"
];

// ছবির লিস্ট
const allImages = [
    "https://files.catbox.moe/fauyiw.jpg",
    "https://files.catbox.moe/ueyfbu.jpg",
    "https://files.catbox.moe/qn7hge.jpg",
    "https://files.catbox.moe/o45lae.jpg",
    "https://files.catbox.moe/p4vddo.jpg",
    "https://files.catbox.moe/c1gcw3.jpg",
    "https://files.catbox.moe/bncb9k.jpg",
    "https://files.catbox.moe/o8v734.jpg",
    "https://files.catbox.moe/fzlmbg.jpg",
    "https://files.catbox.moe/lko19r.jpg",
    "https://files.catbox.moe/nwz1wm.jpg",
    "https://files.catbox.moe/941ul8.jpg",
    "https://files.catbox.moe/ce70hi.jpg",
    "https://files.catbox.moe/mty1y0.jpg",
    "https://files.catbox.moe/fzfnos.jpg"
];

let availableImages = [...allImages];

module.exports.run = async function({ api, event }) {
    // অনুমতি চেক
    if (!allowedAdmins.includes(event.senderID)) {
        return api.sendMessage("এই কমান্ড চালানোর অনুমতি আপনার নেই।", event.threadID);
    }

    if (availableImages.length === 0) {
        availableImages = [...allImages];
    }

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const link = availableImages.splice(randomIndex, 1)[0];
    const imagePath = path.join(os.tmpdir(), `photo_${Date.now()}.jpg`);

    try {
        const writer = fs.createWriteStream(imagePath);
        const response = await axios.get(link, { responseType: 'stream' });
        response.data.pipe(writer);
        await new Promise(res => writer.on('finish', res));

        await api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID);
    } catch (err) {
        console.error(err);
        await api.sendMessage("ছবি আনতে সমস্যা হয়েছে 😔", event.threadID);
    } finally {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
};