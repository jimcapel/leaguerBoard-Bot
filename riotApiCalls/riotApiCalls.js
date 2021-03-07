const fetch = require("node-fetch");
const key = "RGAPI-ec3df374-58bb-4fc4-ab0d-ea71e92e1cc8";//process.env.RIOT_API_KEY;

const getSummonerByName = async (summonername, region) => {


    try{
        
        let summoner = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonername}?api_key=${key}`);

        let summonerJson = await summoner.json();

        let id = summonerJson.id;

        let summonerInfo = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`);

        let summonerInfoJson = await summonerInfo.json();
        
        return [summonerInfoJson, id];

    }catch(error){
        console.log(error);
        return -1;
    }


  
}

const getSummonerById = async (id, region) => {

    try{

        let summonerInfo = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`);

        let summonerInfoJson = await summonerInfo.json();

        return summonerInfoJson

    }catch(error){
        console.log(error);
    }
}

const returnRank = async(summonername, region) =>{
    try{
        
        let summoner = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonername}?api_key=${key}`);

        let summonerJson = await summoner.json();

        let id = summonerJson.id;

        let summonerInfo = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${key}`);

        let summonerInfoJson = await summonerInfo.json();
        
        return summonerInfoJson;

    }catch(error){
        console.log(error);
        return -1;
    }
}

exports.getSummonerByName = getSummonerByName;
exports.getSummonerById = getSummonerById;
exports.returnRank = returnRank;