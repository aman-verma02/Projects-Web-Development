const express = require("express");
const bodyParser = require("body-parser");
 
const app = express(); 

app.use('view engine', 'ejs'); 


app.get("/" , function(req, res){
    
});


let options = {

    weekday: "long", 
    day: "numeric", 
    month: "long"
};
let day = today.toLocaleDateString("en-US" , options);


  res.render("list" , {
    kindOfDay: day,
    newListItems: items
});


app.post("/" , function(req , res){
    let item = req.body.newItem;

    items.push(item);
    res.redirect("/");
    
});



app.listen(3000 ,function(){
    console.log("Server is running"); 
});