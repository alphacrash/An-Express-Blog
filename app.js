var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Post = require("./models/post"),
    Comment = require("./models/comment"),
    seedDB = require("./seed");

mongoose.connect("mongodb://localhost/an-express-blog");

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
seedDB();

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
app.get("/posts/new", function (req, res) {
    res.render("posts/new");
});

app.post("/posts", function (req, res) {
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
app.get("/posts/:id/:comments/:comment_id", function (req, res) {
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

app.listen(3000, function () {
    console.log("Server is running...");
});