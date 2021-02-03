const Discord = require("discord.js");

const ytdl = require("ytdl-core");

const Client = new Discord.Client;

const prefix = "/";

Client.on("ready" , () => { 
    console.log("Bot Opérationnel"); 
});



Client.on("guildMemberAdd" , member => {
    console.log("Un nouveau membre vient d'arriver");
    member.guild.channels.cache.find(channel => channel.id === "784081815681630222").send("@" + member.id + " est arrivé !\nNous sommes désormais **"  + member.guild.memberCount + "** sur le serveur !" );
});

Client.on("guildMemberRemove" , member => {
    console.log("Un membre vient de quitter le serveur");
    member.guild.channels.cache.find(channel => channel.id === "784081815681630222").send(member.displayName + " nous a quitté :tired_face: ");
});



Client.on("message", message => {
    if(message.content.startsWith(prefix + "p")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection => {
                let arguments = message.content.split(" ");

                let dispatcher = connection.play(ytdl(arguments[1], { quality: "highestaudio"}));

                dispatcher.on("finish", () =>  {
                    dispatcher.destroy();
                    connection.disconnect();
                });

                dispatcher.on("error", err => {
                    console.log("Erreur de dispatcher : " +  err);
                });
            }).catch(err => {
                message.reply("Erreur lors de la connexion : " + err );
            });
        }
        else {
            message.reply("Vous n'êtes pas connecté dans un salon vocal. ");
        }
    }
    if(message.member.permissions.has("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "clear")){
            let arguments = message.content.split (" ");

            if(arguments[1] == undefined){
                message.reply("Nombre de message non ou mal défini.");
            }
            else {
                let number = parseInt(arguments[1]);
                
                if(isNaN(number)){
                    message.reply("Nombre de messages non ou mal défini.");
                }
                else {
                    message.channel.bulkDelete(number).then(messages => {
                    
                    }).catch(err => {
                        console.log("Erreur de clear  : " + err);
                    });
                }
            }
        }
    }
    
    if(message.author.bot) return;
    if(message.channel.type == "dm")return;
    
    if(message.member.hasPermission("ADMINISTRATOR")){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné")
            }
            else {
                if(mention.bannable){
                    mention.ban();
                    message.channel.send(mention.displayName + " à été banni avec succès.");
                }
                else{
                    message.reply("Impossible de bannir ce membre.")
                }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné. ");
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.reply(mention.displayName + " à été kick avec succès.")
                }
                else {
                    message.reply("Impossible de kick ce membre. ");
                }
            }
        }
        else if(message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné");

            }
            else {
                mention.roles.add("772872856627445760");
                message.reply( "<@ " + mention.displayName + " > à été mute avec succès. ");
            }
        }
        else if(message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply(("Membre non ou mal mentionné"));
            }
            else {
                mention.roles.remove("772872856627445760");
                message.reply( "<@" + mention.displayName + "> à été unmute avec succès " + '✔');
            }
        }
        else if(message.content.startsWith(prefix + "tempmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply("Membre non ou mal mentionné");
            }
            else {
                let arguments = message.content.split(" ");

                mention.roles.add("772872856627445760");
                setTimeout(function() {
                    mention.roles.remove("772872856627445760");
                    message.reply("<@ " + mention.displayName + " > tu peux désormais de nouveau parler" +  '❗');
                }, arguments[2] * 1000);
            }
        }
    }
});





Client.login(process.env.TOKEN);