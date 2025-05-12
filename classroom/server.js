const express = require("express");
const app = express();
const user = require("./routes/user.js");
const posts = require("./routes/posts.js");
const session = require("express-session");

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));

app.get("/register",(req,res)=>{
  let{name="annonyms"} = req.query;
  console.log(req.session);
  res.send(`hi ${name}`);
})

app.get("/hello",(req,res)=>{
  res.send(`hello`);
})

// app.get("/test", (req, res) => {
//   res.send("test successful");
// });

app.listen(3000, () => {
  console.log("Server is listening in 3000");
});
