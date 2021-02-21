const discord = require("discord.js");
const Sequelize = require("sequelize");
const axios = require("axios");
const cheerio = require("cheerio");


const client = new discord.Client();

//define sqllite model
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

//embed functions

let embedMessage = (toSend) => {

    const embed = new discord.MessageEmbed()
    .setDescription(toSend)

    return embed
}

let embedRank = (username, rank, lp) =>{

    const embed = new discord.MessageEmbed()
    .setDescription(`${username}'s Rank is: \n${rank} ${lp} LP`);

    return embed;

}

let embedRanks = (channelName, members) =>{
    let toSend = "";
    for(let i = 0; i < members.length; i++){
        let x = i + 1;
        toSend += x.toString(10) + ": " +  members[i][0] + " " + members[i][2] + " " + members[i][3] + " LP\n";

    }

    const embed = new discord.MessageEmbed()
    .setTitle(`${channelName} Ranked Leaderbaord!`)
    .setDescription(toSend)

    return embed;
}

//calculators

let rankCalculator = (league, division, lp) =>{

    let leagueIdentifier = "0";
    let divisionIdentifier = "0";


    switch(league){
        case "Iron":
            leagueIdentifier = "1";
            break;
        
        case "Bronze":
            leagueIdentifier = "2";
            break;
        
        case "Silver":
            leagueIdentifier = "3";
            break;

        case "Gold":
            leagueIdentifier = "4";
            break;
        
        case "Platinum":
            leagueIdentifier = "5";
            break;
        
        case "Diamond":
            leagueIdentifier = "6";
            break;
        
        case "Master":
            leagueIdentifier = "7";
            break;
        
        case "Grandmaster":
            leagueIdentifier = "8";
            break;
        
        case "Challenger":
            leagueIdentifier = "9";
            break
        
        default:
            break;

    }

    switch(division){
        case "1":
            divisionIdentifier = "4";
            break;
        case "2":
            divisionIdentifier = "3";
            break;
        case "3":
            divisionIdentifier = "2";
            break;
        case "4":
            divisionIdentifier = "1";
            break;
    }

    let noLp = leagueIdentifier + divisionIdentifier + "000";

    let noLpInt = parseInt(noLp, 10);
    let lpInt = parseInt(lp, 10);

    let rank = noLpInt + lpInt;

    return rank

}

//region change

let regionChange = (region) =>{ 

    let addOne = ["euw", "na", "eun", "br", "jp", "oc", "tr"]

    if(addOne.includes(region)) return region + "1"

    if(region == "lan") return "las1";

    if(region == "las") return "la2";

    return region;
    
}

//axios call

let fetchRank = (region, summonerName) => {
    //let soloText = "";
    //let flexText = "";

    return axios.get(`https://u.gg/lol/profile/${region}/${summonerName}/overview`)
        .then((response) => {
            let $ = cheerio.load(response.data);

            let rankText = $(".rank-text").text().split("LP");
            console.log(rankText);
            console.log(rankText.length);
            //ranktext[0] = "" when failed to get e.g. spelling errors n that
            if(rankText[0] == "Unranked") return rankText;

            let soloText = rankText[0].split("/");
            let flexText = rankText[1].split("/");

            return [soloText, flexText];
            
            
        }
        )
        .catch(error =>{
            console.log(error);
        })


}


client.once("ready", () =>{
    Tags.sync(); //{ force: true }
    console.log("leagueBot online")
})


client.on("message",async message =>{

    const prefix = "!";

    //check if message starts with ! or if sent by bot 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.slice(prefix.length).trim().split(' ');

    args = message.content.slice(prefix.length).trim().split(' ');
    args = message.content.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if(args.length){
        args[0] = regionChange(args[0]);
    }
    console.log(args[0]);

    //deal with command
    if (command == "rank"){

        if(!args.length){
            const tag = await Tags.findOne({where: { username: `${message.author.username}`} });
            if(tag){
                console.log("tag present");
                fetchRank(tag.server, tag.summonerName).
                then(async response => {
                    
                    await Tags.update({league: response[0][0], lp: response[0][1]}, {where: {username: message.author.username, guildId: message.guild.id}} );
                    return message.reply(embedRank(tag.summonerName, response[0][0], response[0][1]));
                    
                    

                })


            }else{
                console.log("no tag stored");
                let msg = `${message.author.tag} you have not bound an account! use \"!add [region] [summonername]\" to bind a summonername to your account`;
                return message.reply(embedMessage(msg));
            }

        }

        //message.channel.send(`command name: ${command} \nArguments: ${args[0]}, ${args[1]}`);
        
        
        else if(args.length == 2){
            fetchRank(args[0], args[1])
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

            let msg = `, summoner ${args[1]} is Unranked!`;
            if(response[0] == "Unranked") return message.reply(msg);

            msg = `${args[1]}'s Rank is: \n${response[0][0]} ${response[0][1]} LP`;
            message.channel.send(embedMessage(msg));
            
        });
        
        }

    }

    if(command == "add"){

        if(args.length != 2) return message.reply(`use \"!add [region] [summonername]\" to bind your account!`);

        let rank = 0;
        await fetchRank(args[0], args[1])
        .then(async response =>{
            if(response[0] == "Unranked") return message.reply(`summoner ${args[1]} is Unranked!`);
            let soloText = response[0];
            rank = rankCalculator(soloText[0].split(" ")[0], soloText[0].split(" ")[1], soloText[1].trim());
            
            try {
                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
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
                console.log(tag);
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

    if(command == "slatt"){
        message.react("👃");
        message.react("👈");
        message.react("👎");
    }

    if(command == "ranks"){
        
        let leaderboard = [];

        const tagList = await Tags.findAll({
            where :{guildId: message.guild.id}
        });
    
        for(let i = 0; i < tagList.length; i++){
            console.log(tagList[i].summonerName);
            leaderboard.push([tagList[i].summonerName, tagList[i].rank, tagList[i].league, tagList[i].lp]);
            console.log(tagList[i].server, tagList[i].summonerName);
        };

        let sorted = leaderboard.sort(function(a, b) {
            return b[1] - a[1];
          })

        return message.channel.send(embedRanks(message.guild.name, sorted));
    }

    if(command == "remove"){

        const row = await Tags.destroy({where : {username: message.author.username, guildId: message.guild.id}});

        if(!row) return message.reply("nothing to remove!");

        return message.reply(`remove succseful!`);
        
    }
    
});




client.login(process.env.BOT_KEY);

