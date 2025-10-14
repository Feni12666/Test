const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
 name: "resend",
 version: "5.0.0",
 hasPermssion: 0,
 credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ TEAM ☢️ | Modified by SH ONIK",
 description: "Auto resend removed messages (no auto delete)",
 commandCategory: "general",
 cooldowns: 0,
 hide: true,
 dependencies: {
  "fs-extra": "",
  axios: ""
 }
};

module.exports.handleEvent = async function ({ event, api, Users }) {
 const { threadID, messageID, senderID, body, attachments, type } = event;

 if (!global.logMessage) global.logMessage = new Map();
 if (!global.data.botID) global.data.botID = api.getCurrentUserID();

 const threadData = global.data.threadData.get(threadID) || {};
 if ((threadData.resend === undefined || threadData.resend !== false) && senderID !== global.data.botID) {

  // store messages to memory
  if (type !== "message_unsend") {
   global.logMessage.set(messageID, {
    msgBody: body,
    attachment: attachments,
    time: Date.now()
   });
  }

  // handle unsend
  if (type === "message_unsend") {
   const msg = global.logMessage.get(messageID);
   if (!msg) return;

   const userName = await Users.getNameUser(senderID);
   const timeNow = new Date().toLocaleTimeString("bn-BD", { hour12: true });

   // only text message
   if (!msg.attachment || msg.attachment.length === 0) {
    return api.sendMessage(
     {
      body: `═════════════════════\n ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭\n═════════════════════\n\n@${userName} এই লুচ্ছায়\n👉 [${msg.msgBody}] 👈\nএই টেক্সটটা রিমুভ দিছে 😏\n⏰ সময়: ${timeNow}\n\n═════════════════════\n𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁\n═════════════════════`,
      mentions: [{ tag: userName, id: senderID }]
     },
     threadID
    );
   }

   // handle attachments
   let attachmentsList = [];
   let count = 0;
   for (const file of msg.attachment) {
    count++;
    const ext = file.url.substring(file.url.lastIndexOf(".") + 1);
    const filePath = __dirname + `/cache/resend_${count}.${ext}`;
    const fileData = (await axios.get(file.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
    attachmentsList.push(fs.createReadStream(filePath));
   }

   const resendMsg = {
    body: `@${userName} এই হালায় এইমাত্র এইডা রিমুভ দিছে 🙆\n⏰ সময়: ${timeNow}\n\n${msg.msgBody ? `Content: ${msg.msgBody}` : ""}`,
    attachment: attachmentsList,
    mentions: [{ tag: userName, id: senderID }]
   };

   return api.sendMessage(resendMsg, threadID);
  }
 }
};

module.exports.languages = {
 bn: {
  on: "♻️ Resend সিস্টেম চালু হয়েছে!",
  off: "❌ Resend সিস্টেম বন্ধ করা হয়েছে!",
  statusOn: "✅ Resend সিস্টেম এখন চালু আছে!",
  statusOff: "❌ Resend সিস্টেম এখন বন্ধ আছে!"
 },
 en: {
  on: "Resend system is now ON ✅",
  off: "Resend system is now OFF ❌",
  statusOn: "✅ Resend system is currently ON",
  statusOff: "❌ Resend system is currently OFF"
 }
};

module.exports.run = async function ({ api, event, Threads, getText, args }) {
 const { threadID, messageID } = event;
 let data = (await Threads.getData(threadID)).data || {};

 // check status
 if (args[0] && args[0].toLowerCase() === "status") {
  return api.sendMessage(
   data.resend ? getText("statusOn") : getText("statusOff"),
   threadID,
   messageID
  );
 }

 // toggle on/off
 data.resend = !data.resend;
 await Threads.setData(threadID, { data });
 global.data.threadData.set(threadID, data);

 return api.sendMessage(
  data.resend ? getText("on") : getText("off"),
  threadID,
  messageID
 );
};