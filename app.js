var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

mongoose.connect("mongodb://localhost/an-express-blog");

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
seedDB();

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

// Index Page
app.get("/", function (req, res) {
    res.render("index");
});

// Archives
app.get("/posts", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("posts/posts", { posts: allPosts });
        }
    });
});

// Create new post
app.get("/posts/new", isLoggedIn, function (req, res) {
    res.render("posts/new");
});

app.post("/posts", isLoggedIn, function (req, res) {
    var newPost = req.body.post;

    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

// Show post
app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/show", { post: foundPost });
        }
    });
});

// COMMENTS

// Create comments
app.get("/posts/:id/:comments/new", isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { post: foundPost });
        }
    });
});

app.post("/posts/:id/comments", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/posts/" + foundPost._id);
                }
            });
        }
    });
});

// AUTH ROUTES
app.get("/register", function (req, res) {
    res.render("auth/register");
});

app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/posts");
            });
        }
    });
});

app.get("/login", function (req, res) {
    res.render("auth/login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
}), function (req, res) { });

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function () {
    console.log("Server is running...");
});