const express = require("express");
const https = require("https");

// Getting body parser in order to hold varible from html
const bodyParser = require("body-parser"); 

// intialing app to use the function of express
const app = express();


app.use(bodyParser.urlencoded({extended: true})); 


// to get from server
app.get("/", (req, res)=> { 

    res.sendFile(__dirname+ "/index.html");

    
    // res.send("server is up and running.")
});


// it posts anything when request  and response happens
app.post("/" , (req , res)=> {

   
    const query = req.body.cityName; 
    const apiKey = "4481ecc720cf649a9cee1da846e755e8";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid="+ apiKey + "&units=" + unit;


    https.get(url , (response)=>{
        console.log(response.statusCode);

        response.on("data", (data)=>{
            const weatherdata = JSON.parse(data);
            const temp = weatherdata.main.temp;
            const description = weatherdata.weather[0].description;
            const icon = weatherdata.weather[0].icon;
            const imageUrl = "https://openweathermap.org/img/wn/"+ icon + "@2x.png";
            res.write("<p>The weather of the  city " + query + " is " + description + "<p>");
            res.write("<h1>The temperature  in " + query +  " is " + temp + " degree celsius.</h1>");
            res.write("<img src="+ imageUrl + ">");
            res.send();
        })

    })





})












app.listen(3000, function(){
    console.log("Server is running on port 3000"); 
});