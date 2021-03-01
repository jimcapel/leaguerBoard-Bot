const fetch = require("node-fetch");
const key = "RGAPI-c79cd7e6-3efc-4a54-b653-9e7c9a7e6e16"; //process.env.RIOT_API_KEY

const getSummoner = async (summonername, region) => {


    try{
        
        let summoner = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonername}?api_key=${key}`);

        let summonerJson = await summoner.json();

        let id = summonerJson.id;

        let summonerInfo = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`);

        let summonerInfoJson = await summonerInfo.json();
        
        return summonerInfoJson

    }catch(error){
        console.log(error);
        return -1;
    }


  
}


exports.getSummoner = getSummoner;