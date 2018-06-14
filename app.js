var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override");
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

var indexRoutes = require("./routes/index"),
    postRoutes = require("./routes/posts"),
    commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/an-express-blog");

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
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
    next();
})

app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments/", commentRoutes);

// SERVER
app.listen(3000, function () {
    console.log("Server is running...");
});