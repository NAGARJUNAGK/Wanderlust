const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); //converting request
const ejsMate = require("ejs-mate"); //creating layout
const ExpressError = require("./utils/ExpressError.js"); //generating errors
const session = require("express-session");
const flash = require("connect-flash");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret : "mysupersecretstring",
  resave : false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  next();
})

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);

// app.get("/testlisting",async (req,res)=>{
//   let sampleListing = new Listing({
//     title : "My new villa",
//     description : "by the beach",
//     price : 1200,
//     location : "goa",
//     country : "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// })

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
