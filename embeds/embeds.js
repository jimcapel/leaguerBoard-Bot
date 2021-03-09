const discord = require("discord.js");

const embedRanks = (channelName, members) => {
    
    let index = "";
    let summonerNames = "";
    let ranks = "";

    for(let i = 0; i < members.length; i++){
        
        let x = i + 1;
        
        if(i == members.length - 1){
            index += x.toString(10);
            summonerNames += members[i][0];
            ranks += members[i][2] + " " + members[i][3] + " " + members[i][4] + " LP"
            break
        }
        

        index += x.toString(10) + "\n";
        summonerNames += members[i][0] + "\n";
        ranks += members[i][2] + " " + members[i][3] + " " + members[i][4] + " LP\n";

    }
    const embed = new discord.MessageEmbed()
        .setTitle(`${channelName} Ranked Leaderbaord!`)
        .addFields(
            {name: "#", value: index, inline: true},
            {name:"Summoner Name:", value: summonerNames, inline: true},
            {name: "Rank:", value: ranks, inline: true},
        )

    return embed;

}

exports.embedRanks = embedRanks;
