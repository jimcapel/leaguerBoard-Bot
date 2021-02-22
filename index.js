const discord = require("discord.js");
const Sequelize = require("sequelize");

//imports
const rankCalculator = require("./args/rankCalculator");
const regionChange = require("./args/regionChange");
const fetchRank = require("./webCalls/axiosCalls");
const embeds = require("./embeds/embeds");

const client = new discord.Client();

//define sqllite model for testing
/*
const sequelize = new Sequelize("database", "username", "password", {
    host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
*/


const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
    logging: false
});


const Tags = sequelize.define("tags", {
    guildId: Sequelize.STRING,
    username:{
        type: Sequelize.STRING,
    },
    summonerName:{
        type: Sequelize.STRING,
    },
    server: Sequelize.STRING,
    rank: Sequelize.INTEGER,
    league: Sequelize.STRING,
    division: Sequelize.STRING,
    lp: Sequelize.STRING,
    

})

client.once("ready", () =>{
    Tags.sync(); //{ force: true }
    console.log("leagueBot online")
})

client.on('guildCreate', guild => {
    console.log(`joined ${guild}`)
  });

client.on("guildDelete", async guild => {
    await Tags.destroy({where : {guildId: guild.id}});

    console.log(`left ${guild}`)
});


client.on("message",async message =>{

    const prefix = "!";

    //check if message starts with ! or if sent by bot 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.slice(prefix.length).trim().split(' ');

    args = message.content.slice(prefix.length).trim().split(' ');
    args = message.content.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if(args.length){
        args[0] = regionChange.regionChange(args[0]);
    }

    //deal with command
    if (command == "rank"){

        if(!args.length){
            const tag = await Tags.findOne({where: { username: `${message.author.username}`} });
            if(tag){
                fetchRank.fetchRank(tag.server, tag.summonerName).
                then(async response => {

                    if(response[0] == "") return message.reply(`${args[1]} not found, did you type the command correctly?`)
                    if(response[0] == "Unranked") return message.reply(`summoner ${args[1]} is Unranked!`);
                    
                    await Tags.update({league: response[0][0], lp: response[0][1]}, {where: {username: message.author.username, guildId: message.guild.id}} );
                    return message.reply(embeds.embedRank(tag.summonerName, response[0][0], response[0][1]));
                    
                    

                })


            }else{
                let msg = `${message.author.tag} you have not bound an account! use \"!add [region] [summonername]\" to bind a summonername to your account`;
                return message.reply(embeds.embedMessage(msg));
            }

        }

        //message.channel.send(`command name: ${command} \nArguments: ${args[0]}, ${args[1]}`);
        
        
        else if(args.length == 2){
            fetchRank.fetchRank(args[0], args[1])
        .then(response =>{
            /*
            if(response[0]){
                let soloRank = "SoloQueue: " + response[0][0] + " " + response[0][1] + " LP";
                message.channel.send(soloRank);
            }
            

            if(response[1][0]){
                let flexRank = "FlexQueue: " + response[1][0] + " " + response[1][1] + " LP";
                message.channel.send(flexRank);
            }
            */

            if(response[0] == "") return message.reply(`${args[1]} not found, did you type the command correctly?`)
            if(response[0] == "Unranked") return message.reply(`summoner ${args[1]} is Unranked!`);

            let msg = `${args[1]}'s Rank is: \n${response[0][0]} ${response[0][1]} LP`;
            message.channel.send(embeds.embedMessage(msg));
            
        });
        
        }

    }

    if(command == "add"){

        if(args.length != 2) return message.reply(`use \"!add [region] [summonername]\" to bind your account!`);

        let row = await Tags.destroy({where : {username: message.author.username, guildId: message.guild.id}});

        if(row) return message.reply("a summonername is already bound, use \"!remove\" to delete current bind");

        let rank = 0;
        await fetchRank.fetchRank(args[0], args[1])
        .then(async response =>{
            if(response[0] == "") return message.reply(`${args[1]} not found, did you type the command correctly?`)
            if(response[0] == "Unranked") return message.reply(`summoner ${args[1]} is Unranked!`);

            let soloText = response[0];
            rank = rankCalculator.rankCalculator(soloText[0].split(" ")[0], soloText[0].split(" ")[1], soloText[1].trim());
            
            try {
                const tag = await Tags.create({
                    guildId: message.guild.id,
                    username: message.author.username,
                    summonerName: args[1],
                    server: args[0],
                    rank: rank,
                    league: soloText[0],
                    division: soloText[1],
                    lp: soloText[1].trim(),


                });
                return message.reply(`${tag.summonerName} added.`);
            }
            catch (e) {
                if (e.name === 'SequelizeUniqueConstraintError') {
                    return message.reply('That tag already exists.');
                }
                return message.reply('Something went wrong with adding a tag.');
            }
            
        })


    }

    if(command == "ranks"){
        
        let leaderboard = [];

        const tagList = await Tags.findAll({
            where :{guildId: message.guild.id}
        });
    
        for(let i = 0; i < tagList.length; i++){
            leaderboard.push([tagList[i].summonerName, tagList[i].rank, tagList[i].league, tagList[i].lp]);
        };

        let sorted = leaderboard.sort(function(a, b) {
            return b[1] - a[1];
          })

        return message.channel.send(embeds.embedRanks(message.guild.name, sorted));
    }

    if(command == "remove"){

        const row = await Tags.destroy({where : {username: message.author.username, guildId: message.guild.id}});

        if(!row) return message.reply("nothing to remove!");

        return message.reply(`remove succseful!`);
        
    }
    
});




client.login(process.env.BOT_KEY);

