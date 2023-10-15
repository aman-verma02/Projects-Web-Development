//jshint esversion: 6


// Declaring const that are going to use in this project
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); 
const https = require("https");
const { url } = require("inspector");

// Getting function of express
const app = express();

// accesing css and images file which can't be use directly by server
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// Getting to home page of the site
app.get("/" , function(req, res){
    res.sendFile(__dirname + "/signup.html")
});



// Getting the data from html form
app.post("/" , function(req , res){

   const firstName = req.body.fName;
   const lastName = req.body.lName;
   const email = req.body.email;

   console.log(firstName, lastName, email);

   const data = {
        members: [
            {
                email_address: email, 
                status: "subscribe",
                merge_fields:{
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

   const jsonData = JSON.stringify(data);

   const url = "https://us21.api.mailchimp.com/3.0/lists/b3198d1434"

   const options = {
    methods: "POST",
    auth:"aman: 8ff8f112d1a73c796cd9a65ae7dafa48-us21"
   }

   const request = https.request(url, options, function(response){
    response.on("data", function(data){
        console.log(JSON.parse(data));
    })
   })

   request.write(jsonData);
   request.end();

});






app.listen (3000, function(){
    console.log("Server is running on port 3000"); 
});




