const axios = require("axios");
const FormData = require("form-data");

const CATBOX_USER_HASH = "ed767b678ab7f742a08eb6d2a";
const CATBOX_API = "https://catbox.moe/user/api.php";
const BASE_API_URL = "http://87.106.36.114:6532";

module.exports.config = {
 name: "sadd",
 version: "1.0.2",
 hasPermssion: 2,
 credits: "Ullash",
 description: "Upload media and save to album.json",
 usePrefix: true,
 commandCategory: "media",
 usages: "Reply media with: /albumadd [category]",
 cooldowns: 3,
};

async function uploadToCatbox(url) {
 const stream = await axios.get(url, { responseType: "stream" });
 const form = new FormData();
 form.append("reqtype", "fileupload");
 form.append("userhash", CATBOX_USER_HASH);
 form.append("fileToUpload", stream.data, { filename: "file.mp4" });

 const res = await axios.post(CATBOX_API, form, { headers: form.getHeaders() });

 if (typeof res.data === "string" && res.data.startsWith("https://files.catbox.moe/")) {
 return res.data;
 } else {
 throw new Error("❌ Catbox upload failed");
 }
}

module.exports.run = async function ({ api, event, args }) {
 const { threadID, messageID, messageReply } = event;

 if (!args[0]) {
 return api.sendMessage("❌ ক্যাটাগরির নাম দিন, যেমন: /albumadd funny", threadID, messageID);
 }

 if (!messageReply?.attachments?.[0]?.url) {
 return api.sendMessage("❌ ভিডিও বা ছবি reply করুন!", threadID, messageID);
 }

 const category = args[0].toLowerCase();
 const mediaUrl = messageReply.attachments[0].url;

 try {
 const catboxUrl = await uploadToCatbox(mediaUrl);
 const res = await axios.get(`${BASE_API_URL}/album?add=${category}&url=${encodeURIComponent(catboxUrl)}`);

 if (res.status === 201 || res.status === 200) {
 return api.sendMessage(
 `✅ Video add successful.\nCatagory:- ${category}\nVideo link:- ${catboxUrl}`,
 threadID,
 messageID
 );
 } else {
 return api.sendMessage("❌ API response invalid!", threadID, messageID);
 }
 } catch (err) {
 console.error("Add error:", err.message);
 return api.sendMessage("❌ ভিডিও/ছবি আপলোড বা সংরক্ষণ করতে সমস্যা হয়েছে।", threadID, messageID);
 }
};
