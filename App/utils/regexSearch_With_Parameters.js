/**
 * 
 * @param {Array} params 
 * @param {String} value 
 */

const regexSearch_With_Parameters = (params, search)=>{

    let searchArray = [];

    for(let value of params){
        searchArray.push({ [value]:{$regex: search, $options:"$i"} });                   
    }

    return searchArray;

}

module.exports = regexSearch_With_Parameters;