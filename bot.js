require('dotenv').config();
const menuJs = require("./menu.js");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(process.env.TOKEN);

client.on(Events.ClientReady, () =>{
    console.log("We have logged in as " + client.user);
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    if (message.content == "!menu") {
        let dico = await menuJs.majMenu();

        // Vérification de si le menu est vide ou pas 
        if(Object.keys(dico).length === 0) {
            messageText = "❌ Menu pas encore disponible ❌";
        } else {
            menuDuJour = menuJs.menuDuJour(dico);
            messageText = "🍽 ___***" + menuDuJour[0] + "***___ 🍽" + "\n";

            for (plat of menuDuJour[1]) {
                messageText += '• ' + plat + "\n"
            }
        }

        await message.channel.send(messageText);
    }

    if(message.content == "!menuAll") {
        let dico = await menuJs.majMenu();

        // Vérification de si le menu est vide ou pas 
        if(Object.keys(dico).length === 0) {
            messageText = "❌ Menu pas encore disponible ❌";
        } else {
            for ([jour, plats] of Object.entries(dico)) {
                messageText += "🍽 ___***" + jour + "***___ 🍽" + "\n";

                for (plat of plats) {
                    messageText += '• ' + plat + "\n";
                }
                
                messageText += '\n';
            }
            
            await message.channel.send(messageText);
        }
    }

    if(message.content == "!help") {
        messageText = "🚧 ___***Liste des commandes***___ 🚧\n!menu : Voir le menu du jours\n!menuAll : Voir tous les menus disponibles";

        await message.channel.send(messageText);
    }
});
