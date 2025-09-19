const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "zisan",
    version: "1.2.0",
    hasPermssion: 2,
    credits: "Md shahadat hosen",
    description: "Send a random photo without repeating until all are sent",
    commandCategory: "image",
    usages: "uniquephoto",
};

// মূল ছবি লিস্ট
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

// ব্যবহার করা হবে এমন ছবি লিস্ট (copy of allImages)
let availableImages = [...allImages];

module.exports.run = async function({ api, event }) {
    try {
        if (availableImages.length === 0) {
            // সব ছবি শেষ হলে আবার লিস্ট রিসেট
            availableImages = [...allImages];
        }

        // Random index নির্বাচন
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const link = availableImages[randomIndex];

        // ছবিটি remove করা যাতে পরেরবার আর না আসে
        availableImages.splice(randomIndex, 1);

        const response = await axios.get(link, { responseType: "arraybuffer" });
        const imagePath = path.join(__dirname, 'temp.jpg');
        fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

        await api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID);

        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error(error);
        await api.sendMessage("Sorry, couldn't fetch the image 😔", event.threadID);
    }
};
