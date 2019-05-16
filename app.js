var express = require("express"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

var indexRoutes = require("./routes/index"),
    postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments");

var url = process.env.DATABASEURL || "mongodb://localhost/express-blog";
mongoose.connect(url);

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Shiba Inu - The Doge",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments/", commentRoutes);

// SERVER
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server is running.")
})

// app.listen(3000, function () {
//     console.log("Server is running...");
// });