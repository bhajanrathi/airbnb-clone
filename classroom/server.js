const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

const sessionOptions = {
    secret: "mysecretsuperstring",
    resave: false,
    saveUnitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next(); 
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name == "anonymous") {
        req.flash("error", "user not registered!");
    } else {
        req.flash("success", "user registered successfully!");
    }
    console.log(req.session);
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
});
// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You've made requests ${req.session.count} times`);
// });

app.listen("8080", () => {
    console.log("Server is listening to port 8080..."); 
});