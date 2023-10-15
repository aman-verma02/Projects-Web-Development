
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Creating database in mongoose 
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true}); 

// Mongoose Schema 
const itemsSchema = { 
  name: String
};

// Mongoose Model 
const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});
const item2 = new Item ({
  name: "<--- Hit this + button to add a new item."
});
const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});


const defaultItems = [ item1, item2 , item3];

// list of items
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  // const day = date.getDate();


  Item.find().then( (foundItems)=> {

    if(foundItems.length === 0){
      // Inserting defaultItems to the database ....
      Item.insertMany(defaultItems).then(function () {
        console.log("Successfully saved defult items to DB");
      }).catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    }
    else{
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }

  }); 
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName);

    // Conditionally check if list already exists or not
    List.findOne({name: customListName}).then(function(foundList){

      if(!foundList){
        //Create a new list
        const list = new List({
          name: customListName, 
          items: defaultItems
        });
        list.save(); // Save

        res.redirect("/" + customListName);
      }
      else { 
        // Show an existing list
        res.render("list", {
          listTitle: foundList.name, 
          newListItems: foundList.items

        });
      }
    }).catch(function(err){
      console.log(err);
    });
  


}); 

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if(listName === "Today"){
    item.save(); 
    res.redirect("/");  
  }else {
    List.findOne({name: listName}).then(function(foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        }).catch(function(err){
          console.log(err);
        });
  }


});

app.post("/delete" , (req , res)=> {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndDelete(checkedItemId).then(function(){
      res.redirect("/");
    }).catch(function(err){
      console.log(err);
    });
  }
  else{
    List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkedItemId}}}).then(function(foundList){
      res.redirect("/" + listName);
    });
  }
  

});



app.get("/about", function(req, res){

  res.render("about");

});




















app.listen(3000, function() {
  console.log("Server started on port 3000");
});
