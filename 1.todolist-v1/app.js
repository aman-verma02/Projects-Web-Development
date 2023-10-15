
// requiring modules
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


// defining to use express anywhere within the app.js file
const app = express();

// declaring array to  store different items
const items = ["body-gym"];
const workItems = [];

// acquiring function to use ejs
app.set('view engine', 'ejs');

//defining body parser to use value from unput
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extendend: true}));


// getting home page ready by the server 
app.get("/" , function(req, res){

    
   const day = date.getDate();
    // giving data to list.ejs
    res.render("list" , {
        listTitle: day,
        newListItems: items
    });

    
    
});

// posting the data entered by the user
app.post("/" , function(req , res){
   const item = req.body.newItem;

    // list  should be  equal to listTitle i.e. "Work list" and below expression ignore the full string i.e. "Work list" 
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work")
    }
    else {
        items.push(item);
        res.redirect("/");
    } 
});


// setting data to work list
app.get("/work", (req , res)=> {

    res.render("list" , {
        listTitle: "Work List" ,
        newListItems: workItems
    });
});


app.get("/about" , (req, res)=> {
    res.render("about");
})

// app.post("/work", (req , res)=>{

//    const item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");


// })





// defining the port at which server is going to runn
app.listen(3000, function(){
    console.log("Server started on port 3000");
})