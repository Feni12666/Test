module.exports.config = {
 name: "resend_text_auto",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "CYBER ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝐀𝐌_ ☢️ (Text-only Auto-on)",
 description: "Auto resend all removed text messages to specific group",
 commandCategory: "general",
 usages: "",
 cooldowns: 0,
 hide: true
};

// ====================== EVENT HANDLER ======================
module.exports.handleEvent = async function ({ event, api, Users }) {
 const { messageID, senderID, body, type } = event;

 if (!global.logMessage) global.logMessage = new Map();
 if (!global.data.botID) global.data.botID = api.getCurrentUserID();

 // save all text messages
 if (type !== "message_unsend") {
   global.logMessage.set(messageID, { msgBody: body });
 }

 // handle unsend
 if (type === "message_unsend") {
   const msg = global.logMessage.get(messageID);
   if (!msg) return;

   const userName = await Users.getNameUser(senderID);
   const targetThreadID = "2186739821790695"; // all unsend text goes here

   if (!msg.msgBody) return; // skip empty

   // send text-only message
   return api.sendMessage(
     `═════════════════════
─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭
═════════════════════

কই গো সবাই দেখুন🥺
@${userName} এই লুচ্ছায়
মাত্র 👉 [${msg.msgBody}] 👈
এই টেক্সট টা রিমুভ দিছে😁

═════════════════════
𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁
═════════════════════`,
     targetThreadID,
     (err, info) => {
       if (!err && info) {
         api.sendMessage({ mentions: [{ tag: userName, id: senderID }] }, targetThreadID);
       }
     }
   );
 }
};

// ====================== COMMAND REMOVED ======================
// Auto-on, তাই কোন run function নেই