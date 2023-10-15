// Requiring all the modules in the current file i.e. app.js
require('dotenv').config();
const express = require("express"); 
const bodyParser = require("body-parser");
const ejs = require("ejs"); 
const mongoose = require("mongoose"); 
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
// const md5 = require("md5"); 
// const encrypt = require("mongoose-encryption"); 
// const bcrypt = require("bcrypt"); 
// const saltRounds = 10; 

const app = express(); 

app.use(express.static("public")); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({
    extended: true
})); 


// It is important to use session here----------------------------------------------------------------
app.use(session({
    secret:"Our little secret",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize()); // Passport initializes the session with the passed in parameters 
app.use(passport.session()); // session is required by default when using session 

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true}); 

// This below code can be used to remove the deprecation warning
// mongoose.set("useCreateIndex" , true); 

// Storing data from user --------------------------------
const userSchema = new mongoose.Schema({
    email: String, 
    password: String ,
    googleId: String , 
    secret: String
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate); 

// Encrypting password using mongoose-password manager---------------------------------------------------------------


const User = new mongoose.model("User" , userSchema); 

passport.use(User.createStrategy()); 

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/" , (req, res) => {
    res.render("home"); 
});

app.get("/auth/google" ,
    passport.authenticate("google", { scope: ["profile"] })
);

app.get( "/auth/google/secrets",
    passport.authenticate( 'google', {
        successRedirect: "/secrets",
        failureRedirect: "/login"
    }
));

app.get("/login" , (req, res) => {
    res.render("login"); 
});

app.get("/register" , (req, res) => {
    res.render("register"); 
});

app.get("/secrets", (req, res) => {

    User.find({"secret": {$ne: null}}).then( (foundUsers)=> {
        res.render("secrets", {usersWithSecrets: foundUsers});
    }).catch( (err)=> {
        console.log(err);
    }); 

});

app.get("/submit", (req, res)=>{
    if(req.isAuthenticated()){
        res.render("submit");
    }
    else{
        res.redirect("/login");
    }
});


// The other major change is that that req.logout() is now an asynchronous function, whereas previously it was synchronous.
//  For instance, a logout route that was previously:
app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err){
        return next(err);
      } 
      res.redirect("/");
    });
  });

// Posting to registered route after registration----------------------------------------------------------------
app.post("/register", (req , res)=> {

    User.register({username: req.body.username }, req.body.password , (err, user)=> {
        if(err) 
        {
            console.log(err); 
            res.redirect("/register"); 
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets"); 
            });
        }
    })
   
});

app.post("/submit", function(req , res){
    const submittedSecret = req.body.secret;

    console.log(req.user.id); 

    User.findById(req.user.id).then( (foundUser)=> {
        if(foundUser){
            foundUser.secret = submittedSecret;
            foundUser.save().then(()=>{
                res.redirect("/secrets");
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch ( (err)=> {
        console.log(err);
    })
        
});

// Posting to login page after login of the user --------------------------------
app.post("/login", (req , res) => {
     
    const user = new User({
        username: req.body.username, 
        password: req.body.password
    });

    req.login(user, (err)=> {
        if(err){
            console.log(err);
        } else { 
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets"); 
            });
        }
    })

});








// Server is running on port 3000; ----------------------------------------------------------------
app.listen(3000 , ()=>{
    console.log("Server is running on port 3000."); 
});



























































// // Posting to registered route after registration----------------------------------------------------------------
// app.post("/register", (req , res)=> {

//     bcrypt.hash(req.body.password, saltRounds , (err, hash)=>{
//         const newUser = new User({
//         email: req.body.username, 
//         password: hash
//         });

//         newUser.save().then( ()=>{
//         res.render("secrets");
//         }).catch( (err)=>{ 
//         console.log(err)   
//         });
//     });


   
// });

// // Posting to login page after login of the user --------------------------------
// app.post("/login", (req , res) => {

    

//     const username = req.body.username ;
//     const password = req.body.password; 

//     User.findOne({email: username} ).then ( (foundUser)=> { 
//         if(foundUser){
//             bcrypt.compare(password, foundUser.password , (err, result)=>{
//                 if(result === true){
//                     res.render("secrets");
//                 }else{
//                     res.render("login");
//                 }
//             });
//         }
//     }).catch( (err)=> {
//         console.log(err); 
//     })
// })