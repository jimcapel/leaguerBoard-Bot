const axios = require("axios");
const cheerio = require("cheerio");

const fetchRank = (region, summonerName) => {
    //let soloText = "";
    //let flexText = "";

    return axios.get(`https://u.gg/lol/profile/${region}/${summonerName}/overview`)
        .then((response) => {
            let $ = cheerio.load(response.data);

            let rankText = $(".rank-text").text().split("LP");
            
            if(rankText[0] == "Unranked" || rankText[0] == "") return rankText;

            let soloText = rankText[0].split("/");
            let flexText = rankText[1].split("/");

            return [soloText, flexText];
            
            
        }
        )
        .catch(error =>{
            console.log(error);
        })


}

exports.fetchRank = fetchRank;