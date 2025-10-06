const axios = require('axios');

const apiEndpoint = "https://edit-and-gen.onrender.com/gen";

module.exports.config = {
 name: "sh",
 version: "1.0",
 credits: "dipto",
 countDown: 5,
 hasPermssion: 2,
 category: "AI",
 commandCategory: "AI",
 description: "Edit a single image into 10 different styles",
 guide: {
 en: "Reply to an image with {pn} [prompt]"
 }
};

async function handleEdit(api, event, args) {
 const url = event.messageReply?.attachments?.[0]?.url;
 const prompt = args.join(" ").trim() || "Enhance this image";

 if (!url) {
 return api.sendMessage("❌ Please reply to an image to edit it.", event.threadID, event.messageID);
 }

 try {
 let editedImages = [];

 // Loop to generate 10 different edits
 for (let i = 1; i <= 10; i++) {
 const stylePrompt = `${prompt} - style ${i}`; // আলাদা স্টাইলের জন্য prompt পরিবর্তন
 const fullURL = `${apiEndpoint}?prompt=${encodeURIComponent(stylePrompt)}&image=${encodeURIComponent(url)}`;

 const response = await axios.get(fullURL, {
 responseType: 'stream',
 validateStatus: () => true
 });

 if (response.headers['content-type']?.startsWith('image/')) {
 editedImages.push(response.data);
 } else {
 let responseData = '';
 for await (const chunk of response.data) responseData += chunk.toString();
 const jsonData = JSON.parse(responseData);
 if (jsonData?.response) {
 await api.sendMessage(jsonData.response, event.threadID, event.messageID);
 }
 }
 }

 if (editedImages.length) {
 return api.sendMessage({
 body: `✨ Edited image into 10 different styles with prompt: "${prompt}"`,
 attachment: editedImages
 }, event.threadID, event.messageID);
 }

 return api.sendMessage("❌ Failed to get edited images from API.", event.threadID, event.messageID);

 } catch (error) {
 console.error("Edit command error:", error);
 return api.sendMessage("❌ Failed to process your request. Please try again later.", event.threadID, event.messageID);
 }
}

module.exports.run = async ({ api, event, args }) => {
 if (!event.messageReply) {
 return api.sendMessage("❌ Please reply to an image.", event.threadID, event.messageID);
 }
 await handleEdit(api, event, args);
};

module.exports.handleReply = async ({ api, event, args }) => {
 if (event.type === "message_reply") {
 await handleEdit(api, event, args);
 }
};