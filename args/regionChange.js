const regionChange = (region) =>{ 

    let addOne = ["euw", "na", "eun", "br", "jp", "oc", "tr"]

    if(addOne.includes(region)) return region + "1"

    if(region == "lan") return "las1";

    if(region == "las") return "la2";

    return region;
    
}

exports.regionChange = regionChange;