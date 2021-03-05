const rankCalculator = (league, division, lp) =>{

    let leagueIdentifier = "0";
    let divisionIdentifier = "0";


    switch(league){
        case "IRON":
            leagueIdentifier = "1";
            break;
        
        case "BRONZE":
            leagueIdentifier = "2";
            break;
        
        case "SILVER":
            leagueIdentifier = "3";
            break;

        case "GOLD":
            leagueIdentifier = "4";
            break;
        
        case "PLATINUM":
            leagueIdentifier = "5";
            break;
        
        case "DIAMOND":
            leagueIdentifier = "6";
            break;
        
        case "MASTER":
            leagueIdentifier = "7";
            break;
        
        case "GRANDMASTER":
            leagueIdentifier = "8";
            break;
        
        case "CHALLENGER":
            leagueIdentifier = "9";
            break
        
        default:
            break;

    }

    switch(division){
        case "I":
            divisionIdentifier = "4";
            break;
        case "II":
            divisionIdentifier = "3";
            break;
        case "III":
            divisionIdentifier = "2";
            break;
        case "IV":
            divisionIdentifier = "1";
            break;
    }

    let noLp = leagueIdentifier + divisionIdentifier + "000";

    let noLpInt = parseInt(noLp, 10);
    console.log(noLpInt);

    let rank = noLpInt + lp;
    console.log(rank);
    return rank

}

exports.rankCalculator = rankCalculator;