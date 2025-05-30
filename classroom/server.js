const express = require("express");
const app = express();
const user = require("./routes/user.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "annonyms" } = req.query;
  req.session.name = name;
  if (name === "annonyms") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered successfully");
  }
  res.redirect(`/hello`);
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});

// app.get("/test", (req, res) => {
//   res.send("test successful");
// });

app.listen(3000, () => {
  console.log("Server is listening in 3000");
});
