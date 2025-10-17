module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "Abdulla Rahaman",
	description: "Record bot activity notifications!",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function({ api, event, Threads }) {
	const logger = require("../../utils/log");
	if (!global.configModule[this.config.name].enable) return;

	let formReport = "💸💸💸 Bot Notification 💸💸💸" +
		"\n\n💌 Thread ID: " + event.threadID +
		"\n😃 Action: {task}" +
		"\n😅 Action created by userID: " + event.author +
		"\n🥰 " + Date.now() + " 🙄",
		task = "";

	switch (event.logMessageType) {
		case "log:thread-name": {
			const oldName = (await Threads.getData(event.threadID)).name || "Name does not exist";
			const newName = event.logMessageData.name || "Name does not exist";
			task = `User changed group name from '${oldName}' to '${newName}'`;
			await Threads.setData(event.threadID, { name: newName });
			break;
		}
		case "log:subscribe": {
			if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID()))
				task = "The user added the bot to a new group!";
			break;
		}
		case "log:unsubscribe": {
			if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID())
				task = "The user kicked the bot out of the group!";
			break;
		}
		default:
			break;
	}

	if (task.length == 0) return;

	formReport = formReport.replace(/\{task}/g, task);

	// ✅ শুধু এই দুইজন আইডিতে রিপোর্ট যাবে
	const godList = ["100001088468923", "61572299956804"];

	for (const god of godList) {
		api.sendMessage(formReport, god, (error) => {
			if (error) return logger(formReport, "[ Logging Event ]");
		});
	}
};