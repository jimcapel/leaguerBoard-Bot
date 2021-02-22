const discord = require("discord.js");

const embedMessage = (toSend) => {

    const embed = new discord.MessageEmbed()
    .setDescription(toSend)

    return embed
}

const embedRank = (username, rank, lp) =>{

    const embed = new discord.MessageEmbed()
    .setDescription(`${username}'s Rank is: \n${rank} ${lp} LP`);

    return embed;

}

const embedRanks = (channelName, members) =>{
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

exports.embedMessage = embedMessage;
exports.embedRank = embedRank;
exports.embedRanks = embedRanks;
