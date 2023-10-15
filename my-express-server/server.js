

const express = require("express");

const app = express(); 

app.get("/" , function(req , res){
    res.send("<h1>Hello my name is Aman Jay Kishan Verma, World</h1>");
});

app.get("/contact" , function(req , res){
    res.send("Contact me at: aman@gmail.com");
});
app.get("/about" , function(req , res){
    res.send("My name is Aman Jay Kishan");
});


app.listen(3000 , function(){
    console.log("server started on part 3000");
});