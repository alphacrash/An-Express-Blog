var express = require("express");
var router = express.Router();
var Post = require("../models/post");

// Archives
router.get("/", function (req, res) {
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
router.get("/new", isLoggedIn, function (req, res) {
    res.render("posts/new");
});

router.post("/", isLoggedIn, function (req, res) {
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
router.get("/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/show", { post: foundPost });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;