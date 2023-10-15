
exports.getDate  = ()=> {
  const today = new Date();

    //object for date 
   const options = {
        weekday: "long", 
        day: "numeric", 
        month: "long"
    };

    // denotes day-array is converted into strings
    return today.toLocaleDateString("en-US" , options); 
}

exports.getDay = ()=> {
  const today = new Date();

    //object for date 
   const options = {
        weekday: "long", 
    };

    // denotes day-array is converted into strings

    return today.toLocaleDateString("en-US" , options); 

}
