const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "zisan",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Md shahadat hosen",
    description: "Send one photo at a time from Catbox links",
    commandCategory: "image",
    usages: "showphoto",
};

let currentIndex = 0; // কোন ছবি পাঠানো হয়েছে ট্র্যাক করার জন্য

const imageLinks = [
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

module.exports.run = async function({ api, event }) {
    const axios = require('axios');

    // বর্তমান ছবি পাঠাও
    const link = imageLinks[currentIndex];
    const response = await axios.get(link, { responseType: "arraybuffer" });
    const imagePath = path.join(__dirname, 'temp.jpg');
    fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));
    await api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID);
    fs.unlinkSync(imagePath);

    // ইন্ডেক্স আপডেট, শেষ হলে প্রথমে ফেরত যাবে
    currentIndex = (currentIndex + 1) % imageLinks.length;
};
