if(process.env.NODE_ENV != "production"){
  require('dotenv').config();//for parsing variables in env file
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); //converting request
const ejsMate = require("ejs-mate"); //creating layout
const ExpressError = require("./utils/ExpressError.js"); //generating errors
const session = require("express-session");//for statefulness
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");//generates alert messages
const passport = require("passport");//for authentication and authorization
const LocalStrategy = require("passport-local");//username password autentication
const User = require("./models/user.js");//user authentication schema
const wrapAsync = require("./utils/wrapAsync.js");


//routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// mongoose connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE");
})

//declearing session options
const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly:true
  }
};

//creating session and flash alearts
app.use(session(sessionOptions));
app.use(flash());

//initializing passport
app.use(passport.initialize());
app.use(passport.session());//for statefulness of the routes
passport.use(new LocalStrategy(User.authenticate()));//static authenticate method

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware for redirecting flash to any route without rendering
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// getting routes from other sources
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// Error if there is no route present
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

//Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  console.log(err);
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});
