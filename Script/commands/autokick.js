const mongoose = require("mongoose");

const reactionKick = "❤";
const reactionCancel = "👎";

module.exports.config = {
  name: "autokick",
  version: "1.1.0",
  credits: "SHAHADAT SAHU",
  hasPermssion: 1,
  description: "Automatically kick users who use banned words.",
  usages: "<on/off/add/del/list>",
  commandCategory: "Group Management",
  cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
  const threadID = event.threadID;

  let record = await global.modelAntiSt.findOne({ where: { threadID } });
  if (!record) record = await global.modelAntiSt.create({ threadID, data: {} });

  const data = record.data || {};
  if (!data.autoKick) data.autoKick = { words: [], enabled: false };

  switch (args[0]) {
    case "on":
      data.autoKick.enabled = true;
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("✅ Auto-kick mode has been enabled.", threadID, event.messageID);

    case "off":
      data.autoKick.enabled = false;
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage("❎ Auto-kick mode has been disabled.", threadID, event.messageID);

    case "add":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to add.", threadID, event.messageID);
      const wordsToAdd = args.slice(1).join(" ").split(",").map(w => w.trim());
      const newWords = wordsToAdd.filter(w => !data.autoKick.words.includes(w));
      data.autoKick.words.push(...newWords);
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`✅ Added ${newWords.length} banned word(s).`, threadID, event.messageID);

    case "del":
      if (!args[1]) return api.sendMessage("⚠️ Please enter words to delete.", threadID, event.messageID);
      const wordsToDelete = args.slice(1).join(" ").split(",").map(w => w.trim());
      const removed = [];
      for (const word of wordsToDelete) {
        const index = data.autoKick.words.indexOf(word);
        if (index !== -1) {
          data.autoKick.words.splice(index, 1);
          removed.push(word);
        }
      }
      await global.modelAntiSt.findOneAndUpdate({ threadID }, { data });
      return api.sendMessage(`🗑️ Removed ${removed.length} banned word(s).`, threadID, event.messageID);

    case "list":
      if (data.autoKick.words.length === 0)
        return api.sendMessage("📜 No banned words set yet.", threadID, event.messageID);
      return api.sendMessage(
        "🚫 Banned Words List:\n" + data.autoKick.words.map(w => `• ${w}`).join("\n"),
        threadID,
        event.messageID
      );

    default:
      return api.sendMessage(
        "☣️ === [ AUTO KICK SYSTEM ] === ☣️\n━━━━━━━━━━━━━━━\n\n" +
        "• autokick add <word(s)> → Add banned words (use comma for multiple)\n" +
        "• autokick del <word(s)> → Delete banned words\n" +
        "• autokick list → Show banned word list\n" +
        "• autokick on → Enable auto-kick\n" +
        "• autokick off → Disable auto-kick\n\n" +
        "❤️ = Kick User\n👎 = Cancel Kick\n\n" +
        "👑 Developed by SHAHADAT SAHU",
        threadID,
        event.messageID
      );
  }
};

module.exports.handleEvent = async ({ api, event, Threads }) => {
  const { senderID, threadID, body } = event;
  if (!body) return;

  try {
    const record = await global.modelAntiSt.findOne({ where: { threadID } });
    const data = record?.data || {};
    if (!data.autoKick || !data.autoKick.enabled) return;

    const threadInfo = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
    const isAdmin = (threadInfo.adminIDs || []).some(el => el.id == senderID);
    const validUIDs = [api.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
    const isPrivileged = isAdmin || validUIDs.includes(senderID);

    if (isPrivileged) return;

    const regex = new RegExp(`(\\s|^)(${data.autoKick.words.join("|")})(\\s|$)`, "i");
    const match = body.toLowerCase().match(regex);

    if (match) {
      return api.sendMessage(
        `🚫 Banned word detected: "${match[0].trim()}"\n\n` +
        `React with '${reactionKick}' to kick the user, or '${reactionCancel}' to cancel.`,
        threadID,
        (err, info) => {
          if (err) return;
          global.client.handleReaction.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            targetID: senderID
          });
        },
        event.messageID
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.handleReaction = async ({ api, event, handleReaction, Users, Threads }) => {
  const { userID, threadID, reaction } = event;
  const { targetID, messageID } = handleReaction;

  const threadInfo = global.data.threadInfo.get(threadID) || await Threads.getInfo(threadID);
  const isAdmin = threadInfo.adminIDs.some(el => el.id == userID);
  const validUIDs = [api.getCurrentUserID(), ...global.config.ADMINBOT, ...global