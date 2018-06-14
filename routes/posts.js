var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middlewareObj = require("../middleware"); 

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
router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
    res.render("posts/new");
});

router.post("/", middlewareObj.isLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = { title: req.body.title, image: req.body.image, content: req.body.content, author: author }

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

// Edit
router.get("/:id/edit", middlewareObj.checkPostOwnership, function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        res.render("posts/edit", { post: foundPost });
    })
});

router.put("/:id", middlewareObj.checkPostOwnership, function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, foundPost) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:id", middlewareObj.checkPostOwnership, function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

module.exports = router;