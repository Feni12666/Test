module.exports.config = {
    name: "kader",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "omseks & fixed by Ullash",
    description: "Kader tweet style (Bangla supported)",
    commandCategory: "edit-img",
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
        "canvas": "",
        "axios": "",
        "fs-extra": ""
    }
};

// টেক্সট wrapping ফাংশন
module.exports.wrapText = (ctx, text, maxWidth) => {
    return new Promise(resolve => {
        if (ctx.measureText(text).width < maxWidth) return resolve([text]);
        if (ctx.measureText('W').width > maxWidth) return resolve(null);
        const words = text.split(' ');
        const lines = [];
        let line = '';

        while (words.length > 0) {
            let split = false;
            while (ctx.measureText(words[0]).width >= maxWidth) {
                const temp = words[0];
                words[0] = temp.slice(0, -1);
                if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
                else {
                    split = true;
                    words.splice(1, 0, temp.slice(-1));
                }
            }

            if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                line += `${words.shift()} `;
            } else {
                lines.push(line.trim());
                line = '';
            }

            if (words.length === 0) lines.push(line.trim());
        }
        return resolve(lines);
    });
};

module.exports.run = async function ({ api, event, args }) {
    const { loadImage, createCanvas, registerFont } = require("canvas");
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const { threadID, messageID } = event;

    // বাংলা ফন্ট লোড করা (Google NotoSansBengali)
    const fontPath = __dirname + "/cache/NotoSansBengali.ttf";
    if (!fs.existsSync(fontPath)) {
        const fontBuffer = (await axios.get("https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf", { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(fontPath, Buffer.from(fontBuffer, 'utf-8'));
    }
    registerFont(fontPath, { family: "NotoSansBengali" });

    const text = args.join(" ");
    if (!text) return api.sendMessage("⚠️ দয়া করে টেক্সট লিখুন!", threadID, messageID);

    const pathImg = __dirname + '/cache/kaderbn.png';

    // 📷 বেস ইমেজ ডাউনলোড
    const imageURL = "https://i.postimg.cc/Bn5cvc8P/Pics-Art-08-14-11-32-52.jpg";
    const imageBuffer = (await axios.get(imageURL, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(pathImg, Buffer.from(imageBuffer, 'utf-8'));

    // 🧠 ক্যানভাস তৈরি
    const baseImage = await loadImage(pathImg);
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    let fontSize = 50;
    ctx.font = `400 ${fontSize}px "NotoSansBengali"`;

    // 📏 ফন্ট সাইজ অ্যাডজাস্ট
    while (ctx.measureText(text).width > 1160) {
        fontSize--;
        ctx.font = `400 ${fontSize}px "NotoSansBengali"`;
    }

    // 🧾 টেক্সট wrapping
    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join('\n'), 30, 179);

    // 💾 ফাইনাল ইমেজ তৈরি
    const finalBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, finalBuffer);

    // 📤 মেসেজ পাঠানো
    return api.sendMessage(
        { attachment: fs.createReadStream(pathImg) },
        threadID,
        () => fs.unlinkSync(pathImg),
        messageID
    );
};