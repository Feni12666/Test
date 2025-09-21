module.exports.config = {
 name: "\n",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "𝐒𝐡𝐚𝐡𝐚𝐃𝐀𝐓 𝐡𝐨𝐬𝐞𝐧",
 description: "Islamick post rendom by caption",
 commandCategory: "poster",
 usages: "/",
 cooldowns: 11,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
 const axios = global.nodemodule["axios"];
 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];

 // 30 বার frame-style hi messages
 var hi = [];
 for(let i=0;i<30;i++){
 hi.push(`✨━━━━━━━━━━━━━━━━━✨
🌸 Assalamualaikum 🌸
✨━━━━━━━━━━━━━━━━━✨

🌺 Thanks you so much for using my bot your group ❤️‍🩹
😻 I hope you all members enjoy! 🤗

☢️ To view any command 📌
/Help
/Bot
/Info

👑 Bot Owner ➢ 𝐒𝐡𝐚𝐡𝐚𝐃𝐀𝐓 𝐡𝐨𝐬𝐞𝐧`);
 }

 var know = hi[Math.floor(Math.random()*hi.length)];

 // এখন শুধু unique 3 টি ছবি
 var link = [
 "https://i.imgur.com/5zfZYf5.jpeg",
 "https://i.imgur.com/03sXhbn.jpeg",
 "https://i.imgur.com/yJztUYb.jpeg"
 ];

 var callback = () => api.sendMessage({body:` ${know} `, attachment: fs.createReadStream(__dirname + "/cyber.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cyber.jpg"));

 // Randomly pick one unique image
 return request(encodeURI(link[Math.floor(Math.random()*link.length)])).pipe(fs.createWriteStream(__dirname+"/cyber.jpg")).on("close",() => callback());
};