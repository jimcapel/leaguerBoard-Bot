const rankCalculator = (league, division, lp) =>{

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

exports.rankCalculator = rankCalculator;